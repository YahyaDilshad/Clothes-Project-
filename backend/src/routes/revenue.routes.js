const express = require('express');
const {
  getRevenueAnalytics,
  getRevenueTransactions,
  exportRevenue,
} = require('../controllers/revenue.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// /export declared before any dynamic segments (defensive ordering).
router.get('/export', protect,  authorize('Administrator', 'Manager', 'Staff'), exportRevenue);
router.get('/analytics', protect, authorize('Administrator', 'Manager'), getRevenueAnalytics);
router.get('/transactions', protect, authorize('Administrator', 'Manager'), getRevenueTransactions);

module.exports = router;
