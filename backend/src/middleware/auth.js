const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model.js');

/**
 * Verifies the JWT sent in the Authorization header (Bearer <token>)
 * and attaches the authenticated user to req.user.
 */
const protect = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  console.log(token || null);
  
  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Not authorized, invalid or expired token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  req.user = user;
  next();
});

/**
 * Restricts access to the given list of roles.
 * Usage: authorize('Admin', 'Manager')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  // Debugging log lagayein taake asliyat pata chale
  console.log("User Role in DB:", `"${req.user.role}"`);
  console.log("Allowed Roles for this route:", roles);

  // Trim() use karein taake hidden spaces ka masla khatam ho
  const userRole = req.user.role ? req.user.role.trim() : "";
  const isAllowed = roles.some(role => role.trim() === userRole);

  if (!isAllowed) {
    throw new ApiError(403, `Role '${req.user.role}' is not permitted to perform this action`);
  }
  
  next();
};

module.exports = { protect, authorize };
