// Test Calendar API call
import { apiService } from './services/api.js';

console.log('🧪 Testing Calendar API...');

async function testCalendarAPI() {
  try {
    console.log('📅 Testing Calendar API call...');
    
    const data = await apiService.request('/calendar', {
      method: 'POST',
      body: JSON.stringify({
        date: new Date().toISOString(),
        view: 'month'
      }),
      headers: {
        'x-timezone': 'UTC'
      }
    });
    
    console.log('✅ Calendar API response:', data);
    console.log('🎉 Calendar API test passed!');
  } catch (error) {
    console.error('❌ Calendar API test failed:', error);
  }
}

testCalendarAPI();
