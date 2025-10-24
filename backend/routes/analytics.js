import express from 'express';
const router = express.Router();

// Import controllers
import {
  getDashboardAnalytics,
  getHabitTrends,
  getWeeklySummary
} from '../controllers/analyticsController.js';

import { verifyToken } from '../middleware/auth.js';

// All routes require authentication
router.use(verifyToken);

// Analytics endpoints
router.get('/dashboard', getDashboardAnalytics);
router.get('/trends', getHabitTrends);
router.get('/weekly', getWeeklySummary);

export default router;
