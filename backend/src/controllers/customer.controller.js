const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// GET /api/customers?page=&limit=&search=
const getCustomers = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, isActive } = req.query;

  const filter = {};
  if (search) filter.$text = { $search: search };
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  sendResponse(res, 200, customers, 'Customers fetched', buildMeta({ page, limit, total }));
});

// POST /api/customers
const createCustomer = catchAsync(async (req, res) => {
  const { name, email, phone, address, notes } = req.body;
  if (!name) throw new ApiError(400, 'name is required');

  if (email) {
    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) throw new ApiError(409, 'A customer with this email already exists');
  }

  const customer = await Customer.create({ name, email, phone, address, notes });
  sendResponse(res, 201, customer, 'Customer created successfully');
});

// GET /api/customers/:id  (includes recent order history)
const getCustomerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer) throw new ApiError(404, 'Customer not found');

  const orders = await Order.find({ customer: id }).sort({ createdAt: -1 }).limit(20);

  sendResponse(res, 200, { ...customer.toObject(), recentOrders: orders }, 'Customer fetched');
});

module.exports = { getCustomers, createCustomer, getCustomerById };
