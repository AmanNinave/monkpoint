import { quotesService } from '../services/quotesService.js';

/**
 * Get a random motivational quote
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRandomQuote = async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.force === 'true';
    console.log(`🧘 Fetching random quote for user${forceRefresh ? ' (forced refresh)' : ''}`);
    
    const quote = await quotesService.getRandomQuote(forceRefresh);
    
    res.json({
      success: true,
      quote,
      message: 'Quote retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting random quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote',
      message: error.message
    });
  }
};

/**
 * Get multiple random quotes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMultipleQuotes = async (req, res) => {
  try {
    const { count = 3 } = req.query;
    const numCount = parseInt(count, 10);
    
    if (isNaN(numCount) || numCount < 1 || numCount > 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid count parameter',
        message: 'Count must be between 1 and 10'
      });
    }

    console.log(`🧘 Fetching ${numCount} quotes for user`);
    
    const quotes = await quotesService.getMultipleQuotes(numCount);
    
    res.json({
      success: true,
      quotes,
      count: quotes.length,
      message: `${quotes.length} quotes retrieved successfully`
    });
  } catch (error) {
    console.error('Error getting multiple quotes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quotes',
      message: error.message
    });
  }
};

/**
 * Get quotes by specific author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getQuotesByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    
    if (!author || author.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Author parameter is required',
        message: 'Please provide an author name'
      });
    }

    console.log(`🧘 Fetching quote by author: ${author}`);
    
    const quote = await quotesService.getQuoteByAuthor(author);
    
    res.json({
      success: true,
      quote,
      author: author,
      message: `Quote by ${author} retrieved successfully`
    });
  } catch (error) {
    console.error(`Error getting quote by author ${req.params.author}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote by author',
      message: error.message
    });
  }
};

/**
 * Get cache statistics for quotes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCacheStats = async (req, res) => {
  try {
    const stats = quotesService.getCacheStats();
    
    res.json({
      success: true,
      cache: stats,
      message: 'Cache statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics',
      message: error.message
    });
  }
};

/**
 * Clear the quote cache
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const clearCache = async (req, res) => {
  try {
    quotesService.clearCache();
    
    res.json({
      success: true,
      message: 'Quote cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    });
  }
};
