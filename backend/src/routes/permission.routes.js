const express = require('express');
const { getPermissionsByRole, setPermissionsByRole } = require('../controllers/permission.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:roleName', protect, authorize('Admin', 'Manager'), getPermissionsByRole);
router.post('/:roleName', protect, authorize('Admin'), setPermissionsByRole);

module.exports = router;
