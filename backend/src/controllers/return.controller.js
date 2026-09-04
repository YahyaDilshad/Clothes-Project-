const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/paginate');
const Return = require('../models/Return');
const Order = require('../models/Order');
const generateCode = require('../utils/generateCode');
const { restockItems } = require('../services/order.service');

// GET /api/returns?page=&limit=&status=&order=
const getReturns = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, order, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (order) filter.order = order;
  if (search) filter.returnNumber = { $regex: search, $options: 'i' };

  const [returns, total] = await Promise.all([
    Return.find(filter)
      .populate('order', 'orderNumber total')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Return.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Returns fetched successfully',
    data: returns,
    meta: buildMeta(total, page, limit),
  });
});

// POST /api/returns
// Not in the originally requested endpoint list, but added so returns
// have a real creation path for the frontend to call (a GET-only /returns
// resource with no way to create one would have nothing to list).
const createReturn = catchAsync(async (req, res) => {
  const { orderId, items, reason, customer } = req.body;
  if (!orderId || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'orderId and at least one item are required');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  // Validate that each returned item actually exists on the order and
  // doesn't exceed the ordered quantity.
  const orderItemMap = new Map(order.items.map((i) => [i.product.toString(), i]));
  for (const item of items) {
    const orderItem = orderItemMap.get(String(item.product));
    if (!orderItem) {
      throw new ApiError(400, `Product ${item.product} was not part of order ${order.orderNumber}`);
    }
    if (item.quantity > orderItem.quantity) {
      throw new ApiError(400, `Cannot return more than the ordered quantity for '${orderItem.name}'`);
    }
  }

  const refundAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const ret = await Return.create({
    returnNumber: generateCode('RET'),
    order: order._id,
    customer: customer || order.customer,
    items,
    reason,
    refundAmount,
  });

  res.status(201).json({
    success: true,
    message: 'Return request created successfully',
    data: ret
  });
});

// PUT /api/returns/:id/status
const updateReturnStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['requested', 'approved', 'rejected', 'completed'];
  if (!allowed.includes(status)) {
    throw new ApiError(400, `status must be one of: ${allowed.join(', ')}`);
  }

  const ret = await Return.findById(id);
  if (!ret) throw new ApiError(404, 'Return not found');

  const wasRestocked = ret.restocked;

  if ((status === 'approved' || status === 'completed') && !wasRestocked) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await restockItems(ret.items, 'return_restock', session);
        ret.restocked = true;
        ret.status = status;
        ret.processedBy = req.user?._id || null;
        await ret.save({ session });

        // Reflect refund on the originating order's payment status.
        await Order.updateOne(
          { _id: ret.order },
          { $set: { paymentStatus: 'refunded' } },
          { session }
        );
      });
    } finally {
      session.endSession();
    }
  } else {
    ret.status = status;
    ret.processedBy = req.user?._id || null;
    await ret.save();
  }

  res.status(200).json({
    success: true,
    message: 'Return status updated',
    data: ret
  });
});

module.exports = { getReturns, createReturn, updateReturnStatus };
