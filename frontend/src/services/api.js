import { API_ENDPOINTS } from '../config/api'

// API Service class for handling all API calls
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS.AUTH.REGISTER.split('/auth')[0] // Extract base URL
    this.pendingRequests = new Map() // Track pending requests to prevent duplicates
  }

  // Generic fetch method with error handling and request deduplication
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    
    // Create a unique key for this request to prevent duplicates
    const requestKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || '')}`
    
    // If the same request is already pending, return the existing promise
    if (this.pendingRequests.has(requestKey)) {
      console.log('🔄 Deduplicating request:', requestKey)
      return this.pendingRequests.get(requestKey)
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    // Add authorization header if token exists
    const token = localStorage.getItem('token')
    console.log('🔑 API Service - Token check:', { 
      hasToken: !!token, 
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    })
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('⚠️ No authentication token found in localStorage')
    }

    // Create the request promise
    const requestPromise = this._makeRequest(url, { ...defaultOptions, ...options })
    
    // Store the promise to prevent duplicate requests
    this.pendingRequests.set(requestKey, requestPromise)
    
    try {
      const result = await requestPromise
      return result
    } finally {
      // Clean up the pending request
      this.pendingRequests.delete(requestKey)
    }
  }

  // Internal method to make the actual request
  async _makeRequest(url, options) {
    try {
      const response = await fetch(url, options)
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
