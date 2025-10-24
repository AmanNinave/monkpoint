import { apiService } from './api.js';

class QuotesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 1 * 60 * 1000; // 1 minute
  }

  /**
   * Get a random motivational quote
   * @param {boolean} forceRefresh - Force fetch new quote, bypass cache
   * @returns {Promise<Object>} Quote object
   */
  async getRandomQuote(forceRefresh = false) {
    try {
      // If force refresh, clear cache first
      if (forceRefresh) {
        this.cache.clear();
        console.log('🔄 Cache cleared for fresh quote');
      }
      
      // Check cache first (unless force refresh is requested)
      const cacheKey = 'random_quote';
      const cached = this.cache.get(cacheKey);
      if (!forceRefresh && cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('📜 Returning cached quote');
        return cached.data;
      }

      console.log('🌅 Fetching fresh quote from API');
      const url = forceRefresh ? '/quotes/random?refresh=true' : '/quotes/random';
      const response = await apiService.request(url);
      
      if (response.success) {
        // Cache the quote
        this.cache.set(cacheKey, {
          data: response.quote,
          timestamp: Date.now()
        });
        
        return response.quote;
      } else {
        throw new Error(response.error || 'Failed to fetch quote');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      return this.getFallbackQuote();
    }
  }

  /**
   * Get multiple random quotes
   * @param {number} count - Number of quotes to fetch
   * @returns {Promise<Array>} Array of quote objects
   */
  async getMultipleQuotes(count = 3) {
    try {
      const response = await apiService.request(`/quotes/multiple?count=${count}`);
      
      if (response.success) {
        return response.quotes;
      } else {
        throw new Error(response.error || 'Failed to fetch quotes');
      }
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [this.getFallbackQuote()];
    }
  }

  /**
   * Get quotes by specific author
   * @param {string} author - Author name
   * @returns {Promise<Object>} Quote object
   */
  async getQuoteByAuthor(author) {
    try {
      const response = await apiService.request(`/quotes/author/${encodeURIComponent(author)}`);
      
      if (response.success) {
        return response.quote;
      } else {
        throw new Error(response.error || 'Failed to fetch quote by author');
      }
    } catch (error) {
      console.error(`Error fetching quote by author ${author}:`, error);
      return this.getFallbackQuote();
    }
  }

  /**
   * Get fallback quote when API fails
   * @returns {Object} Fallback quote object
   */
  getFallbackQuote() {
    const fallbackQuotes = [
      {
        text: "The present moment is the only time over which we have dominion.",
        author: "Thích Nhất Hạnh",
        html: "<blockquote>The present moment is the only time over which we have dominion.</blockquote>",
        source: "MonkPoint Fallback",
        timestamp: new Date().toISOString()
      },
      {
        text: "Peace comes from within. Do not seek it without.",
        author: "Buddha",
        html: "<blockquote>Peace comes from within. Do not seek it without.</blockquote>",
        source: "MonkPoint Fallback",
        timestamp: new Date().toISOString()
      },
      {
        text: "The mind is everything. What you think you become.",
        author: "Buddha",
        html: "<blockquote>The mind is everything. What you think you become.</blockquote>",
        source: "MonkPoint Fallback",
        timestamp: new Date().toISOString()
      },
      {
        text: "Be the change that you wish to see in the world.",
        author: "Mahatma Gandhi",
        html: "<blockquote>Be the change that you wish to see in the world.</blockquote>",
        source: "MonkPoint Fallback",
        timestamp: new Date().toISOString()
      },
      {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        html: "<blockquote>The journey of a thousand miles begins with one step.</blockquote>",
        source: "MonkPoint Fallback",
        timestamp: new Date().toISOString()
      }
    ];

    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }

  /**
   * Clear the quote cache
   */
  clearCache() {
    this.cache.clear();
    console.log('📜 Quote cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const quotesService = new QuotesService();
export default quotesService;
