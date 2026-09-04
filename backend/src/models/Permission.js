const mongoose = require('mongoose');
const { ROLES } = require('../config/roles');

const permissionSchema = new mongoose.Schema(
  {
    roleName: { type: String, enum: ROLES, required: true, unique: true },
    permissions: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Permission', permissionSchema);
