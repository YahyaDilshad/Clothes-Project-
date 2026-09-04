const express = require('express');
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staff.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('Administrator', 'Manager', 'Staff'), getStaff);
router.post('/add', protect, authorize('Administrator', 'Manager', 'Staff'), createStaff);
router.put('/:id', protect, authorize('Administrator', 'Manager', 'Staff'), updateStaff);
router.delete('/:id', protect, authorize('Administrator', 'Manager', 'Staff'), deleteStaff);

module.exports = router;
