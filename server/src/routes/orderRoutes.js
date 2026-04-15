const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Define API routes for Orders
router.get('/', authenticate, orderController.getOrders);

// Any authenticated role can create an order (Cashier, Manager, Admin)
router.post('/', authenticate, orderController.createOrder);

// Phase 3: Geo-Fulfillment Optimal Routing API
router.post('/route-optimal', authenticate, orderController.routeOptimalOrder);

router.put('/:id', authenticate, authorizeRoles('manager', 'admin'), orderController.updateOrder);
router.delete('/:id', authenticate, authorizeRoles('admin'), orderController.deleteOrder);

module.exports = router;
