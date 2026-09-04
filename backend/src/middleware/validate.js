const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an array of express-validator checks and turns any
 * validation failures into a single formatted ApiError (400).
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  next(new ApiError(400, 'Validation failed', formatted));
};

module.exports = validate;
