import express from 'express';
const router = express.Router();

// Import controllers
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  getHabitEntries,
  logHabitEntry,
  deleteHabitEntry,
  getHabitAnalytics
} from '../controllers/habitsController.js';

import { verifyToken } from '../middleware/auth.js';

// All routes require authentication
router.use(verifyToken);

// Habit CRUD operations
router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);

// Habit entries
router.get('/:habitId/entries', getHabitEntries);
router.post('/:habitId/entries', logHabitEntry);
router.delete('/entries/:entryId', deleteHabitEntry);

// Analytics
router.get('/:habitId/analytics', getHabitAnalytics);

export default router;
