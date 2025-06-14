// routes/productRoutes.js

import express from 'express';
const router = express.Router();

import {
addCustomer,
updateCustomerController,
getCustomers,
getCustomerById,
getCustomerByName,
getCustomerByPhone
} from '../controllers/customerController.js';

import { authenticateToken } from '../middlewares/authMiddleware.js'; // ✅ Import middleware
import { authorizeRole } from '../middlewares/authorizeRole.js';

// ✅ Apply middleware to all routes below
router.use(authenticateToken);

// Create a new customer
router.post('/add', addCustomer);

// Get all customer
router.get('/', getCustomers);


// Update customer
router.put('/:customer_id', updateCustomerController);

// Find customer by name
router.get('/search/name/:name', getCustomerByName);

// Find customer by ID
router.get('/search/id/:customer_id', getCustomerById);

// Find customer by Phone
router.get('/search/phone/:phone_number', getCustomerByPhone);


export default router;