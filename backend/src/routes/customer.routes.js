const express = require('express');
const { getCustomers, createCustomer, getCustomerById } = require('../controllers/customer.controller');
const { protect , authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect , authorize("Administrator"), getCustomers);
router.post('/', protect , authorize("Administrator"), createCustomer);
router.get('/:id', protect , authorize("Administrator"), getCustomerById);

module.exports = router;
