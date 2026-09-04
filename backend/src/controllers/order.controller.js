const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Order = require('../models/Order');
const generateCode = require('../utils/generateCode');
const {
  buildOrderItems,
  computeTotals,
  decrementStockForItems,
  restockItems,
  applyCustomerStats,
} = require('../services/order.service');

// GET /api/orders?page=&limit=&status=&paymentStatus=&customer=&search=&from=&to=
const getOrders = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, paymentStatus, customer, search, from, to } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (customer) filter.customer = customer;
  if (search) filter.orderNumber = { $regex: search, $options: 'i' };
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  sendResponse(res, 200, orders, 'Orders fetched', buildMeta({ page, limit, total }));
});

// POST /api/orders
const createOrder = catchAsync(async (req, res) => {
  const { customer, items, discount = 0, taxRate = 0, shippingFee = 0, paymentMethod, amountPaid, channel } = req.body;

  const { items: builtItems, subtotal } = await buildOrderItems(items);
  const { tax, total } = computeTotals({ subtotal, discount: Number(discount), taxRate: Number(taxRate), shippingFee: Number(shippingFee) });

  const paid = Number(amountPaid) || 0;
  let paymentStatus = 'unpaid';
  if (paid >= total && total > 0) paymentStatus = 'paid';
  else if (paid > 0) paymentStatus = 'partial';

  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      order = await Order.create(
        [
          {
            orderNumber: generateCode('ORD'),
            customer: customer || null,
            items: builtItems,
            subtotal,
            discount: Number(discount),
            tax,
            shippingFee: Number(shippingFee),
            total,
            paymentMethod: paymentMethod || 'cash',
            amountPaid: paid,
            paymentStatus,
            channel: channel || 'pos',
            createdBy: req.user?._id || null,
          },
        ],
        { session }
      );
      order = order[0];

      await decrementStockForItems(builtItems, session);
      await applyCustomerStats(customer, total, session);
    });
  } finally {
    session.endSession();
  }

  sendResponse(res, 201, order, 'Order created successfully');
});

// PATCH /api/orders/:id/status
const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'processing', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    throw new ApiError(400, `status must be one of: ${allowed.join(', ')}`);
  }

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  // If an order is cancelled after being placed, restock its items.
  if (status === 'cancelled' && order.status !== 'cancelled') {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await restockItems(order.items, 'order_cancelled', session);
        order.status = status;
        await order.save({ session });
      });
    } finally {
      session.endSession();
    }
  } else {
    order.status = status;
    await order.save();
  }

  sendResponse(res, 200, order, 'Order status updated');
});

// PATCH /api/orders/:id/payment
const updateOrderPayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, amountPaid, paymentMethod } = req.body;

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (paymentMethod) order.paymentMethod = paymentMethod;
  if (amountPaid !== undefined) order.amountPaid = Number(amountPaid);

  if (paymentStatus) {
    const allowed = ['unpaid', 'partial', 'paid', 'refunded'];
    if (!allowed.includes(paymentStatus)) {
      throw new ApiError(400, `paymentStatus must be one of: ${allowed.join(', ')}`);
    }
    order.paymentStatus = paymentStatus;
  } else if (amountPaid !== undefined) {
    // Auto-derive payment status from amountPaid if not explicitly given.
    if (order.amountPaid >= order.total && order.total > 0) order.paymentStatus = 'paid';
    else if (order.amountPaid > 0) order.paymentStatus = 'partial';
    else order.paymentStatus = 'unpaid';
  }

  await order.save();
  sendResponse(res, 200, order, 'Order payment updated');
});

// POST /api/orders/:id/notes
const addOrderNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text || !text.trim()) throw new ApiError(400, 'Note text is required');

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.notes.push({ text: text.trim(), author: req.user?._id || null });
  await order.save();

  sendResponse(res, 201, order, 'Note added to order');
});

module.exports = { getOrders, createOrder, updateOrderStatus, updateOrderPayment, addOrderNote };
