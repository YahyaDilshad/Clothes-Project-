const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Expense = require('../models/Expense');

// GET /api/expenses?page=&limit=&category=&from=&to=&search=
const getExpenses = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, from, to, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const [expenses, total, totals] = await Promise.all([
    Expense.find(filter).populate('createdBy', 'name role').sort({ date: -1 }).skip(skip).limit(limit),
    Expense.countDocuments(filter),
    Expense.aggregate([{ $match: filter }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
  ]);

  sendResponse(res, 200, expenses, 'Expenses fetched', {
    ...buildMeta({ page, limit, total }),
    totalAmount: totals[0]?.sum || 0,
  });
});

// POST /api/expenses
const createExpense = catchAsync(async (req, res) => {
  const { title, category, amount, description, date, paymentMethod } = req.body;
  if (!title || amount === undefined) {
    throw new ApiError(400, 'title and amount are required');
  }

  const expense = await Expense.create({
    title,
    category,
    amount,
    description,
    date: date || Date.now(),
    paymentMethod,
    createdBy: req.user?._id || null,
  });

  sendResponse(res, 201, expense, 'Expense created successfully');
});

// DELETE /api/expenses/:id
const deleteExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  if (!expense) throw new ApiError(404, 'Expense not found');

  await expense.deleteOne();
  sendResponse(res, 200, null, 'Expense deleted successfully');
});

module.exports = { getExpenses, createExpense, deleteExpense };
