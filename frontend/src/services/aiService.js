import { API_ENDPOINTS } from '../config/api';

class AIService {
  constructor() {
    this.baseURL = API_ENDPOINTS.AI.INSIGHTS.split('/ai/insights')[0]; // Extract base URL
  }

  async request(url, method = 'GET', data = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication required, but no token found.');
    }

    const config = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.error || 'Something went wrong');
        error.status = response.status;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  // Initialize AI Assistant
  async initialize() {
    return this.request(API_ENDPOINTS.AI.INITIALIZE, 'POST');
  }

  // Create a new conversation thread
  async createThread() {
    return this.request(API_ENDPOINTS.AI.THREAD, 'POST');
  }

  // Send message to AI assistant
  async sendMessage(threadId, message) {
    return this.request(API_ENDPOINTS.AI.MESSAGE, 'POST', {
      threadId,
      message
    });
  }

  // Get AI insights and recommendations
  async getInsights() {
    return this.request(API_ENDPOINTS.AI.INSIGHTS, 'GET');
  }

  // Get habit suggestions from AI
  async getHabitSuggestions(preferences, goals, currentHabits) {
    return this.request(API_ENDPOINTS.AI.HABIT_SUGGESTIONS, 'POST', {
      preferences,
      goals,
      currentHabits
    });
  }

  // Get goal suggestions from AI
  async getGoalSuggestions(timeframe, focus, currentGoals) {
    return this.request(API_ENDPOINTS.AI.GOAL_SUGGESTIONS, 'POST', {
      timeframe,
      focus,
      currentGoals
    });
  }

  // Analyze mood patterns
  async analyzeMoodPatterns(days = 30) {
    return this.request(`${API_ENDPOINTS.AI.MOOD_ANALYSIS}?days=${days}`, 'GET');
  }

  // Get motivational message
  async getMotivation(context, streak, recentProgress) {
    return this.request(API_ENDPOINTS.AI.MOTIVATION, 'POST', {
      context,
      streak,
      recentProgress
    });
  }

  // Get habit recommendations
  async getHabitRecommendations(category, difficulty, timeAvailable) {
    return this.request(API_ENDPOINTS.AI.HABIT_RECOMMENDATIONS, 'POST', {
      category,
      difficulty,
      timeAvailable
    });
  }

  // Get AI coaching session
  async getCoachingSession(topic, duration = 'short') {
    return this.request(API_ENDPOINTS.AI.COACHING, 'POST', {
      topic,
      duration
    });
  }
}

export const aiService = new AIService();
