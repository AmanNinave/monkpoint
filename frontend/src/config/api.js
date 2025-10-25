// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  HEALTH: `${API_BASE_URL}/health`,
  AI: {
    INITIALIZE: `${API_BASE_URL}/ai/initialize`,
    THREAD: `${API_BASE_URL}/ai/thread`,
    MESSAGE: `${API_BASE_URL}/ai/message`,
    INSIGHTS: `${API_BASE_URL}/ai/insights`,
    HABIT_SUGGESTIONS: `${API_BASE_URL}/ai/suggestions/habits`,
    GOAL_SUGGESTIONS: `${API_BASE_URL}/ai/suggestions/goals`,
    MOOD_ANALYSIS: `${API_BASE_URL}/ai/analysis/mood`,
    MOTIVATION: `${API_BASE_URL}/ai/motivation`,
    HABIT_RECOMMENDATIONS: `${API_BASE_URL}/ai/recommendations/habits`,
    COACHING: `${API_BASE_URL}/ai/coaching`
  },
  QUOTES: {
    RANDOM: `${API_BASE_URL}/quotes/random`,
    MULTIPLE: `${API_BASE_URL}/quotes/multiple`,
    BY_AUTHOR: `${API_BASE_URL}/quotes/author`,
    CACHE_STATS: `${API_BASE_URL}/quotes/cache/stats`,
    CLEAR_CACHE: `${API_BASE_URL}/quotes/cache`
  },
  CALENDAR: {
    DATA: `${API_BASE_URL}/calendar`
  }
};
