const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
// product.routes.js (Updated)
router.get('/', protect, authorize('Administrator', 'Manager', 'Staff'), getProducts);
router.post('/add', protect, authorize('Administrator', 'Manager', 'Staff'), upload.array('images', 10), createProduct);
router.put('/update/:id', protect, authorize('Administrator', 'Manager', 'Staff'), upload.array('images', 10), updateProduct);
router.delete('/delete/:id', protect, authorize('Administrator', 'Manager', 'Staff'), deleteProduct);
router.post('/duplicate/:id', protect, authorize('Administrator', 'Manager', 'Staff'), duplicateProduct);

module.exports = router;
