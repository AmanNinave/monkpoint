import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getRandomQuote,
  getMultipleQuotes,
  getQuotesByAuthor,
  getCacheStats,
  clearCache
} from '../controllers/quotesController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get a random motivational quote
router.get('/random', getRandomQuote);

// Get multiple random quotes
router.get('/multiple', getMultipleQuotes);

// Get quotes by specific author
router.get('/author/:author', getQuotesByAuthor);

// Get cache statistics (admin/debug endpoint)
router.get('/cache/stats', getCacheStats);

// Clear quote cache (admin/debug endpoint)
router.delete('/cache', clearCache);

export default router;
