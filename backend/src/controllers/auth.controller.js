const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const User = require('../models/User');
const { generateToken } = require('../services/token.service');

// POST /api/auth/register
const register = catchAsync(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  // Only allow role selection if the request is made by an already
  // authenticated Admin (staff creation). Public self-registration
  // always defaults to the lowest-privilege role.
  const assignedRole = req.user && req.user.role === 'Admin' && role ? role : 'Cashier';

  const user = await User.create({ name, email, password, phone, role: assignedRole });
  const token = generateToken(user._id);

  sendResponse(res, 201, { user: user.toSafeObject(), token }, 'User registered successfully');
});

// POST /api/auth/login
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    // Find user and explicitly include password
    const user = await User.findOne({
        email: email.trim().toLowerCase(),
    }).select('+password');

    // Invalid credentials
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Check account status
    if (!user.isActive) {
        throw new ApiError(403, 'This account has been deactivated');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT
    const token = generateToken(user._id);

    // Send response
    return sendResponse(
        res,
        200,
        {
            user: user.toSafeObject(),
            token,
        },
        'Login successful'
    );
});


// GET /api/auth/me
const me = catchAsync(async (req, res) => {
    return sendResponse(
        res,
        200,
        req.user.toSafeObject(),
        'Current user fetched'
    );
});



module.exports = { register, login, me };
