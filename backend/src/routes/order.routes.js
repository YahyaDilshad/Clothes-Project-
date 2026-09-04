const express = require('express');
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  updateOrderPayment,
  addOrderNote,
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getOrders);
router.post('/add', protect, authorize('Administrator', 'Manager', 'Staff'), createOrder);
router.patch('/:id/status', protect, authorize('Administrator', 'Manager', 'Staff'), updateOrderStatus);
router.patch('/:id/payment', protect, authorize('Administrator', 'Manager', 'Staff', 'Cashier'), updateOrderPayment);
router.post('/:id/notes', protect, addOrderNote);

module.exports = router;
