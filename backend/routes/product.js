// with middleware

// routes/productRoutes.js

import express from 'express';
const router = express.Router();

import {
  addProduct,
  getProducts,
  updateProductController,
  toggleProductActivation,
  getProductByName,
  getProductNames
} from '../controllers/productController.js';

import { authenticateToken } from '../middlewares/authMiddleware.js'; // ✅ Import middleware
import { authorizeRole } from '../middlewares/authorizeRole.js';

// ✅ Apply middleware to all routes below
router.use(authenticateToken);


// Get all products
router.get('/', getProducts);

// Find product by name
router.get('/search/:name', getProductByName);

// Get product names (maybe for dropdowns or autocomplete)
router.get('/productNames', getProductNames);

// Create a new product
// router.post('/add', addProduct);
router.post('/add', authorizeRole('admin'), addProduct);


// Update product
// router.put('/:oldProductName', updateProductController);
router.put('/:oldProductName',  authorizeRole('admin'), updateProductController);


// Toggle active/inactive status
router.patch('/:productName/toggle-status',  authorizeRole('admin'), toggleProductActivation);


export default router;