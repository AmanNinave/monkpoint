// API Configuration
export const API_BASE_URL = 'http://localhost:3001/api'

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
  },
  HEALTH: `${API_BASE_URL}/health`
}
