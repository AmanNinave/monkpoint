// Test authentication status
console.log('🧪 Testing authentication status...');

// Check localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('🔑 Token status:', {
  hasToken: !!token,
  tokenLength: token ? token.length : 0,
  tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
});

console.log('👤 User status:', {
  hasUser: !!user,
  userData: user ? JSON.parse(user) : null
});

// Test API call
import { apiService } from './services/api.js';

async function testAuth() {
  try {
    console.log('🧪 Testing authenticated API call...');
    const response = await apiService.request('/auth/profile');
    console.log('✅ Auth test successful:', response);
  } catch (error) {
    console.error('❌ Auth test failed:', error);
  }
}

testAuth();
