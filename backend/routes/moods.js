import express from 'express';
const router = express.Router();

// Import controllers
import {
  getMoods,
  logMood,
  getMoodAnalytics,
  deleteMood
} from '../controllers/moodsController.js';

import { verifyToken } from '../middleware/auth.js';

// All routes require authentication
router.use(verifyToken);

// Mood operations
router.get('/', getMoods);
router.post('/', logMood);
router.delete('/:id', deleteMood);

// Analytics
router.get('/analytics', getMoodAnalytics);

export default router;
