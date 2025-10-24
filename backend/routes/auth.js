import express from 'express';
const router = express.Router();

// Import auth controller and middleware
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';

import { verifyToken } from '../middleware/auth.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.post('/logout', verifyToken, logout);

export default router;
