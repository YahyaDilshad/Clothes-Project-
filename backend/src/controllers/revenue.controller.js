const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const { sendCsv } = require('../utils/csv');
const Order = require('../models/Order');
const Expense = require('../models/Expense');

// Shared date-range resolver: ?from=&to= (ISO dates), defaults to last 30 days.
const resolveRange = (query) => {
  const to = query.to ? new Date(query.to) : new Date();
  const from = query.from ? new Date(query.from) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
};

// GET /api/revenue/analytics?from=&to=
const getRevenueAnalytics = catchAsync(async (req, res) => {
  const { from, to } = resolveRange(req.query);

  const [orderStats, paymentBreakdown, expenseStats] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          grossRevenue: { $sum: '$total' },
          totalDiscount: { $sum: '$discount' },
          totalTax: { $sum: '$tax' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$total' },
        },
      },
    ]), 
    Order.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' } } },
    ]),
  ]);

 // Controller mein ye lines update karein:
const stats = orderStats[0] || {}; // Fallback to empty object
const gross = stats.grossRevenue || 0;
const expenses = expenseStats[0]?.totalExpenses || 0;

sendResponse(
  res,
  200,
  {
    range: { from, to },
    grossRevenue: gross,
    totalDiscount: stats.totalDiscount || 0,
    totalTax: stats.totalTax || 0,
    orderCount: stats.orderCount || 0,
    avgOrderValue: stats.avgOrderValue || 0,
    totalExpenses: expenses,
    netRevenue: Number((gross - expenses).toFixed(2)),
    paymentBreakdown,
  },
  'Revenue analytics fetched'
);
});

// GET /api/revenue/transactions?page=&limit=&from=&to=&paymentMethod=
const getRevenueTransactions = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { from, to } = resolveRange(req.query);
  const { paymentMethod, status } = req.query;

  const filter = { createdAt: { $gte: from, $lte: to } };
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (status) filter.status = status;

  const [transactions, total] = await Promise.all([
    Order.find(filter)
      .select('orderNumber total tax discount paymentMethod paymentStatus status createdAt customer')
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  sendResponse(res, 200, transactions, 'Revenue transactions fetched', buildMeta({ page, limit, total }));
});

// GET /api/revenue/export?from=&to=
const exportRevenue = catchAsync(async (req, res) => {
  const { from, to } = resolveRange(req.query);

  const orders = await Order.find({ createdAt: { $gte: from, $lte: to } })
    .populate('customer', 'name')
    .sort({ createdAt: -1 });

  const rows = orders.map((o) => ({
    orderNumber: o.orderNumber,
    customer: o.customer?.name || 'Walk-in',
    subtotal: o.subtotal,
    discount: o.discount,
    tax: o.tax,
    shippingFee: o.shippingFee,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  sendCsv(res, `revenue-export-${Date.now()}.csv`, rows, [
    'orderNumber', 'customer', 'subtotal', 'discount', 'tax', 'shippingFee', 'total',
    'paymentMethod', 'paymentStatus', 'status', 'createdAt',
  ]);
});

module.exports = { getRevenueAnalytics, getRevenueTransactions, exportRevenue };
