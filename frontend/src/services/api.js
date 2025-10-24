import { API_ENDPOINTS } from '../config/api'

// API Service class for handling all API calls
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS.AUTH.REGISTER.split('/auth')[0] // Extract base URL
  }

  // Generic fetch method with error handling
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    // Add authorization header if token exists
    const token = localStorage.getItem('token')
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth methods
  async register(userData) {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getProfile() {
    return this.request(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
    })
  }

  async logout() {
    return this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    })
  }

  // Health check
  async healthCheck() {
    return this.request(API_ENDPOINTS.HEALTH, {
      method: 'GET',
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
