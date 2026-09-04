    const express = require('express');

    const authRoutes = require('./auth.routes');
    const productRoutes = require('./product.routes');
    const categoryRoutes = require('./category.routes');
    const collectionRoutes = require('./collection.routes');
    const orderRoutes = require('./order.routes');
    const customerRoutes = require('./customer.routes');
    const inventoryRoutes = require('./inventory.routes');
    const staffRoutes = require('./staff.routes');
    const permissionRoutes = require('./permission.routes');
    const expenseRoutes = require('./expense.routes');
    const returnRoutes = require('./return.routes');
    const exchangeRoutes = require('./exchange.routes');
    const dashboardRoutes = require('./dashboard.routes');
    const revenueRoutes = require('./revenue.routes');

    const router = express.Router();

    router.get('/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));

    router.use('/auth', authRoutes);
    router.use('/products', productRoutes);
    router.use('/categories', categoryRoutes);
    router.use('/collections', collectionRoutes);
    router.use('/orders', orderRoutes);
    router.use('/customers', customerRoutes);
    router.use('/inventory', inventoryRoutes);
    router.use('/staff', staffRoutes);
    router.use('/permissions', permissionRoutes);
    router.use('/expenses', expenseRoutes);
    router.use('/returns', returnRoutes);
    router.use('/exchanges', exchangeRoutes);
    router.use('/dashboard', dashboardRoutes);
    router.use('/revenue', revenueRoutes);

    module.exports = router;
