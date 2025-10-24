# API Configuration

This directory contains the API configuration for the frontend application.

## Files

- `api.js` - Contains API endpoints and base URL configuration

## Usage

### API Endpoints
```javascript
import { API_ENDPOINTS } from '../config/api'

// Use specific endpoints
const registerUrl = API_ENDPOINTS.AUTH.REGISTER
const loginUrl = API_ENDPOINTS.AUTH.LOGIN
```

### API Service
```javascript
import { apiService } from '../services/api'

// Use the service for API calls
const data = await apiService.register(userData)
const loginData = await apiService.login(credentials)
```

## Configuration

The API base URL is currently set to `http://localhost:3001/api`. To change this:

1. Update the `API_BASE_URL` in `src/config/api.js`
2. All endpoints will automatically use the new base URL

## Environment Variables (Alternative)

If you prefer using environment variables, you can:

1. Create a `.env` file in the frontend root
2. Add: `VITE_API_BASE_URL=http://localhost:3001/api`
3. Update `api.js` to use: `import.meta.env.VITE_API_BASE_URL`
