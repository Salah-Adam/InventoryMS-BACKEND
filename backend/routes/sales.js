// routes/salesRoutes.js
import express from 'express';
import * as SalesController from '../controllers/salesController.js';

const router = express.Router();

import { authenticateToken } from '../middlewares/authMiddleware.js'; // ✅ Import middleware
import { authorizeRole } from '../middlewares/authorizeRole.js';

// ✅ Apply middleware to all routes below
router.use(authenticateToken);

// GET all sales
router.get('/', SalesController.getSales);

// GET sales by order ID
router.get('/search/:orderId', SalesController.getSalesByOrder);

// POST new sales
router.post('/add', SalesController.addSales);


// PUT update sales by order ID
router.put('/:orderId', SalesController.updateSales);

// PATCH toggle sale status (activate/deactivate)
router.patch('/toggle/:orderId/:productName', SalesController.toggleSaleStatus);

export default router;