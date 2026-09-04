const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { ROLES, DEFAULT_PERMISSIONS } = require('../config/roles');
const Permission = require('../models/Permission');

// GET /api/permissions/:roleName
const getPermissionsByRole = catchAsync(async (req, res) => {
  const { roleName } = req.params;
  if (!ROLES.includes(roleName)) {
    throw new ApiError(400, `roleName must be one of: ${ROLES.join(', ')}`);
  }

  let record = await Permission.findOne({ roleName });
  if (!record) {
    // Fall back to (and persist) the system default permission set the
    // first time a role is queried, so subsequent edits have a document
    // to update.
    record = await Permission.create({
      roleName,
      permissions: DEFAULT_PERMISSIONS[roleName] || [],
    });
  }

  sendResponse(res, 200, record, 'Permissions fetched');
});

// POST /api/permissions/:roleName   { permissions: string[] }
const setPermissionsByRole = catchAsync(async (req, res) => {
  const { roleName } = req.params;
  const { permissions } = req.body;

  if (!ROLES.includes(roleName)) {
    throw new ApiError(400, `roleName must be one of: ${ROLES.join(', ')}`);
  }
  if (!Array.isArray(permissions)) {
    throw new ApiError(400, 'permissions must be an array of permission strings');
  }

  const record = await Permission.findOneAndUpdate(
    { roleName },
    { roleName, permissions },
    { upsert: true, new: true, runValidators: true }
  );

  sendResponse(res, 200, record, 'Permissions updated successfully');
});

module.exports = { getPermissionsByRole, setPermissionsByRole };
