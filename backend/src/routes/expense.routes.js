const express = require('express');
const { getExpenses, createExpense, deleteExpense } = require('../controllers/expense.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getExpenses);
router.post('/add', protect,authorize('Administrator', 'Manager', 'Staff'), createExpense);
router.delete('/delete/:id', protect, authorize('Administrator', 'Manager'), deleteExpense);

module.exports = router;
