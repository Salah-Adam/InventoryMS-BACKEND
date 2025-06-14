// const express = require('express');
import express from 'express';
const router = express.Router();

import { register, login, getUsers,
getUserByUsernameOrPhone, updateUserController, toggleActivation, logout, refreshToken
} from '../controllers/userController.js';


import { authenticateToken } from '../middlewares/authMiddleware.js'; // ✅ Import middleware
import { authorizeRole } from '../middlewares/authorizeRole.js';

// router.post('/login', authorizeRole('admin'), login);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);


// ✅ Apply middleware to all routes below
router.use(authenticateToken);
router.get('/', authorizeRole('admin'), getUsers);

router.post('/register', authorizeRole('admin'), register);
router.get('/search/:identifier',authorizeRole('admin'), getUserByUsernameOrPhone);
router.put('/:id', authorizeRole('admin'), updateUserController);
router.patch('/:id/toggle-status',authorizeRole('admin'),  toggleActivation);


export default router;
