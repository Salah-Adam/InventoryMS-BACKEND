// routes/productRoutes.js

import express from 'express';
const router = express.Router();

import {
findReport, findLoan
} from '../controllers/reportController.js';

import { authenticateToken } from '../middlewares/authMiddleware.js'; // ✅ Import middleware
import { authorizeRole } from '../middlewares/authorizeRole.js';

// ✅ Apply middleware to all routes below
router.use(authenticateToken);


// Get all products

router.get('/', authorizeRole('admin'), findReport);
router.get('/loan', authorizeRole('admin'), findLoan);




export default router;