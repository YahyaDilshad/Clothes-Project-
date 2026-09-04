const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/',  getCategories);
router.post('/add', upload.single('image'), createCategory);
router.put('/update/:id', upload.single('image'), updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;
