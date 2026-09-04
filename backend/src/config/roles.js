// Central definition of roles and their default permission sets.
// Permissions can be further customized per-role via the Permission model
// (see models/Permission.js and controllers/permission.controller.js).

const ROLES = ['Admin', 'Manager', 'Staff', 'Cashier'];

const DEFAULT_PERMISSIONS = {
  Admin: [
    'products:read', 'products:write', 'products:delete',
    'categories:read', 'categories:write', 'categories:delete',
    'collections:read', 'collections:write',
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'inventory:read', 'inventory:write',
    'staff:read', 'staff:write', 'staff:delete',
    'expenses:read', 'expenses:write', 'expenses:delete',
    'returns:read', 'returns:write',
    'exchanges:read', 'exchanges:write', 'exchanges:delete',
    'dashboard:read', 'revenue:read',
    'permissions:read', 'permissions:write',
  ],
  Manager: [
    'products:read', 'products:write',
    'categories:read', 'categories:write',
    'collections:read', 'collections:write',
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'inventory:read', 'inventory:write',
    'staff:read',
    'expenses:read', 'expenses:write',
    'returns:read', 'returns:write',
    'exchanges:read', 'exchanges:write',
    'dashboard:read', 'revenue:read',
  ],
  Staff: [
    'products:read',
    'categories:read',
    'collections:read',
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'inventory:read',
    'returns:read', 'returns:write',
    'exchanges:read', 'exchanges:write',
  ],
  Cashier: [
    'products:read',
    'categories:read',
    'collections:read',
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'inventory:read',
    'returns:read',
    'exchanges:read',
  ],
};

module.exports = { ROLES, DEFAULT_PERMISSIONS };
