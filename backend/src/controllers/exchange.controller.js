const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Exchange = require('../models/Exchange');
const Order = require('../models/Order');
const Product = require('../models/Product');
const generateCode = require('../utils/generateCode');
const { restockItems, decrementStockForItems } = require('../services/order.service');

// GET /api/exchanges?page=&limit=&status=&order=
const getExchanges = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, order, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (order) filter.order = order;
  if (search) filter.exchangeNumber = { $regex: search, $options: 'i' };

  const [exchanges, total] = await Promise.all([
    Exchange.find(filter)
      .populate('order', 'orderNumber total')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Exchange.countDocuments(filter),
  ]);

  sendResponse(res, 200, exchanges, 'Exchanges fetched', buildMeta({ page, limit, total }));
});

// POST /api/exchanges
const createExchange = catchAsync(async (req, res) => {
  const { orderId, customer, oldProductId, oldQuantity, newProductId, newQuantity, reason } = req.body;

  if (!orderId || !oldProductId || !newProductId) {
    throw new ApiError(400, 'orderId, oldProductId and newProductId are required');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const orderItem = order.items.find((i) => i.product.toString() === String(oldProductId));
  if (!orderItem) throw new ApiError(400, 'The old product was not part of this order');

  const oldQty = Number(oldQuantity) || 1;
  if (oldQty > orderItem.quantity) {
    throw new ApiError(400, `Cannot exchange more than the ordered quantity for '${orderItem.name}'`);
  }

  const newProduct = await Product.findById(newProductId);
  if (!newProduct) throw new ApiError(404, 'New product not found');

  const newQty = Number(newQuantity) || 1;
  if (newProduct.stock < newQty) {
    throw new ApiError(409, `Insufficient stock for '${newProduct.name}'. Available: ${newProduct.stock}`);
  }

  const priceDifference = Number((newProduct.price * newQty - orderItem.price * oldQty).toFixed(2));

  const exchange = await Exchange.create({
    exchangeNumber: generateCode('EXC'),
    order: order._id,
    customer: customer || order.customer,
    oldItem: {
      product: orderItem.product,
      name: orderItem.name,
      quantity: oldQty,
      price: orderItem.price,
    },
    newItem: {
      product: newProduct._id,
      name: newProduct.name,
      quantity: newQty,
      price: newProduct.price,
    },
    priceDifference,
    reason,
  });

  sendResponse(res, 201, exchange, 'Exchange request created successfully');
});

// PATCH /api/exchanges/:id
const updateExchange = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const exchange = await Exchange.findById(id);
  if (!exchange) throw new ApiError(404, 'Exchange not found');

  if (reason !== undefined) exchange.reason = reason;

  if (status) {
    const allowed = ['requested', 'approved', 'rejected', 'completed'];
    if (!allowed.includes(status)) {
      throw new ApiError(400, `status must be one of: ${allowed.join(', ')}`);
    }

    // Completing an exchange moves inventory: restock the old item,
    // decrement stock for the new item.
    if (status === 'completed' && exchange.status !== 'completed') {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          await restockItems(
            [{ product: exchange.oldItem.product, quantity: exchange.oldItem.quantity }],
            'exchange_restock',
            session
          );
          await decrementStockForItems(
            [{ product: exchange.newItem.product, quantity: exchange.newItem.quantity }],
            session
          );
          exchange.status = status;
          exchange.processedBy = req.user?._id || null;
          await exchange.save({ session });
        });
      } finally {
        session.endSession();
      }
    } else {
      exchange.status = status;
      exchange.processedBy = req.user?._id || null;
      await exchange.save();
    }
  } else {
    await exchange.save();
  }

  sendResponse(res, 200, exchange, 'Exchange updated successfully');
});

// DELETE /api/exchanges/:id
const deleteExchange = catchAsync(async (req, res) => {
  const { id } = req.params;
  const exchange = await Exchange.findById(id);
  if (!exchange) throw new ApiError(404, 'Exchange not found');

  if (exchange.status === 'completed') {
    throw new ApiError(400, 'Cannot delete a completed exchange');
  }

  await exchange.deleteOne();
  sendResponse(res, 200, null, 'Exchange deleted successfully');
});

module.exports = { getExchanges, createExchange, updateExchange, deleteExchange };
