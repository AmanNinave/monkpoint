import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  initializeAI,
  createThread,
  sendMessage,
  getInsights,
  getHabitSuggestions,
  getGoalSuggestions,
  analyzeMoodPatterns,
  getMotivation,
  getHabitRecommendations,
  getCoachingSession
} from '../controllers/aiController.js';

const router = express.Router();

// Initialize AI Assistant (admin only - can be called once)
router.post('/initialize', initializeAI);

// Create a new conversation thread
router.post('/thread', verifyToken, createThread);

// Send message to AI assistant
router.post('/message', verifyToken, sendMessage);

// Get AI insights and recommendations
router.get('/insights', verifyToken, getInsights);

// Get habit suggestions from AI
router.post('/suggestions/habits', verifyToken, getHabitSuggestions);

// Get goal suggestions from AI
router.post('/suggestions/goals', verifyToken, getGoalSuggestions);

// Analyze mood patterns
router.get('/analysis/mood', verifyToken, analyzeMoodPatterns);

// Get motivational message
router.post('/motivation', verifyToken, getMotivation);

// Get habit recommendations
router.post('/recommendations/habits', verifyToken, getHabitRecommendations);

// Get AI coaching session
router.post('/coaching', verifyToken, getCoachingSession);

export default router;
