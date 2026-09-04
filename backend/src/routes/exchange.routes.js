const express = require('express');
const {
  getExchanges,
  createExchange,
  updateExchange,
  deleteExchange,
} = require('../controllers/exchange.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getExchanges);
router.post('/add', protect,authorize('Administrator', 'Manager', 'Staff'), createExchange);
router.patch('/:id', protect, authorize('Administrator', 'Manager', 'Staff'), updateExchange);
router.delete('/:id', protect, authorize('Administrator', 'Manager'), deleteExchange);

module.exports = router;
