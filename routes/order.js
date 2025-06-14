// routes/productRoutes.js

import express from 'express';
const router = express.Router();

import {
  getOrders,
  updateOrderController,
  toggleOrderActivation,
  getOrderByOrderId
} from '../controllers/orderController.js';

import { authenticateToken } from '../middlewares/authMiddleware.js'; // ✅ Import middleware
import { authorizeRole } from '../middlewares/authorizeRole.js';

// ✅ Apply middleware to all routes below
router.use(authenticateToken);

// Get all products
router.get('/', getOrders);

// Find product by name
router.get('/search/:orderId', getOrderByOrderId);

// Update product
router.put('/:order_id', updateOrderController);

// Toggle active/inactive status
router.patch('/:orderId/toggle-status', toggleOrderActivation);

export default router;