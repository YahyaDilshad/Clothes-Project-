const ApiError = require('../utils/ApiError');

// Catches unknown routes and forwards a 404 ApiError.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Normalizes known Mongoose/JS errors into ApiError shape, then
// sends a single consistent JSON error response.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errors = [];

    // Mongoose invalid ObjectId
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid value for field '${error.path}': ${error.value}`;
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {}).join(', ');
      message = `Duplicate value for field(s): ${field}`;
    }

    // Multer file errors
    if (error.name === 'MulterError') {
      statusCode = 400;
      message = error.message;
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }

    error = new ApiError(statusCode, message, errors);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
