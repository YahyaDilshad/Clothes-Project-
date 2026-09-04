const express = require('express');
const { getDashboardCharts } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/charts', protect , authorize('Administrator', 'Manager', 'Staff'), getDashboardCharts);

module.exports = router;
