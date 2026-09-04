const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { getPagination, buildMeta } = require('../utils/paginate');
const { ROLES } = require('../config/roles');
const User = require('../models/user.model');

// GET /api/staff?page=&limit=&search=&role=
const getStaff = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, role, isActive } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [staff, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  sendResponse(res, 200, staff, 'Staff fetched', buildMeta({ page, limit, total }));
});

// POST /api/staff
const createStaff = catchAsync(async (req, res) => {
  const { name, email, phone, role , status} = req.body;
  if (!name || !email || !role) {
    throw new ApiError(400, 'name, email and role are required');
  }
  if (role && !ROLES.includes(role)) {
    throw new ApiError(400, `role must be one of: ${ROLES.join(', ')}`);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'A staff member with this email already exists');

  const staff = await User.create({ name, email,phone, role: role || 'Staff' });
  sendResponse(res, 201, staff.toSafeObject(), 'Staff member created successfully');
});

// PUT /api/staff/:id
const updateStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const staff = await User.findById(id);
  if (!staff) throw new ApiError(404, 'Staff member not found');

  const { name, phone, role, isActive, password } = req.body;
  if (role && !ROLES.includes(role)) {
    throw new ApiError(400, `role must be one of: ${ROLES.join(', ')}`);
  }

  if (name !== undefined) staff.name = name;
  if (phone !== undefined) staff.phone = phone;
  if (role !== undefined) staff.role = role;
  if (isActive !== undefined) staff.isActive = isActive;
  if (password) staff.password = password; // will be re-hashed via pre-save hook

  await staff.save();
  sendResponse(res, 200, staff.toSafeObject(), 'Staff member updated successfully');
});

// DELETE /api/staff/:id
const deleteStaff = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (req.user && req.user._id.toString() === id) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const staff = await User.findById(id);
  if (!staff) throw new ApiError(404, 'Staff member not found');

  await staff.deleteOne();
  sendResponse(res, 200, null, 'Staff member deleted successfully');
});

module.exports = { getStaff, createStaff, updateStaff, deleteStaff };
