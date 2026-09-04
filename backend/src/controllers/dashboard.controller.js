const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/ApiResponse');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/dashboard/charts?days=30
// Returns time-series revenue/order-count data plus quick summary
// stats and top-selling products for admin dashboard charts.
const getDashboardCharts = catchAsync(async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const [salesByDay, topProducts, orderStatusBreakdown, summary] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' },
        },
      },
    ]),
  ]);

  const lowStockCount = await Product.countDocuments({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } });

  res.status(200).json({
    success: true,
    message: 'Dashboard charts data fetched successfully',
    data: {
      salesByDay,
      topProducts,
      orderStatusBreakdown,
      summary: summary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
      lowStockCount,
    },
  });
});

module.exports = { getDashboardCharts };
