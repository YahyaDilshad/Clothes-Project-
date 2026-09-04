const express = require('express');
const {
  getInventory,
  adjustInventory,
  syncInventory,
  exportInventory,
} = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// NOTE: /export must be declared before any dynamic /:id-style routes
// on this router to avoid being swallowed by a param route. There is
// no GET /:id here, but this ordering convention is kept intentionally.
router.get('/export', protect, authorize('Administrator', 'Manager', 'Staff'), exportInventory);
router.get('/', protect, authorize('Administrator', 'Manager', 'Staff'), getInventory);
router.patch('/adjust/:id', protect, authorize('Administrator', 'Manager', 'Staff'), adjustInventory);
router.post('/sync', protect, authorize('Administrator', 'Manager', 'Staff'),  syncInventory);

module.exports = router;
