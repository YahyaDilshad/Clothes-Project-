const express = require('express');
const { getReturns, createReturn, updateReturnStatus } = require('../controllers/return.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getReturns);
// POST /returns is an addition beyond the original spec so returns can
// actually be created — see comment in the controller.
router.post('/', protect, protect, authorize('Administrator', 'Manager', 'Staff'), createReturn);
router.put('/:id/status', protect, authorize('Administrator', 'Manager'), updateReturnStatus);

module.exports = router;
