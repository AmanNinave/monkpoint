import express from 'express';
const router = express.Router();

// Import controllers
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress
} from '../controllers/goalsController.js';

import { verifyToken } from '../middleware/auth.js';

// All routes require authentication
router.use(verifyToken);

// Goal CRUD operations
router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

// Goal progress
router.patch('/:id/progress', updateGoalProgress);

export default router;
