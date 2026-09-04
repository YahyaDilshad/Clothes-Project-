const express = require('express');
const { 
  getCollections, 
  createCollection, 
  updateCollection, 
  deleteCollection 
} = require('../controllers/collection.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Sabhi logged in users dekh sakte hain
router.get('/', protect, getCollections);

// Sirf Administrator, Manager ya Staff hi add, update, delete kar sakte hain
router.post(
  '/add', 
  protect, 
  authorize('Administrator', 'Manager', 'Staff'), 
  upload.single('image'), 
  createCollection
);

router.put(
  '/update/:id', 
  protect, 
  authorize('Administrator', 'Manager', 'Staff'), 
  upload.single('image'), 
  updateCollection
);

router.delete(
  '/delete/:id', 
  protect, 
  authorize('Administrator', 'Manager'), // Delete ki permission manager/admin ko rakhein
  deleteCollection
);

module.exports = router;