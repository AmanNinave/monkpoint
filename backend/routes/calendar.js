import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getCalendarData } from '../controllers/calendarController.js';

const router = express.Router();

// All calendar routes require authentication
router.use(verifyToken);

// Get calendar data for different views
router.post('/', getCalendarData);

export default router;
