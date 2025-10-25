// Test script to verify calendar functionality
import { apiService } from './services/api.js';

const testCalendar = async () => {
  console.log('🧪 Testing Calendar API...');
  
  try {
    // Test month view
    console.log('📅 Testing month view...');
    const monthData = await apiService.request('/calendar', {
      method: 'POST',
      body: JSON.stringify({
        date: new Date().toISOString(),
        view: 'month'
      })
    });
    console.log('✅ Month view data:', monthData);
    
    // Test week view
    console.log('📅 Testing week view...');
    const weekData = await apiService.request('/calendar', {
      method: 'POST',
      body: JSON.stringify({
        date: new Date().toISOString(),
        view: 'week'
      })
    });
    console.log('✅ Week view data:', weekData);
    
    // Test day view
    console.log('📅 Testing day view...');
    const dayData = await apiService.request('/calendar', {
      method: 'POST',
      body: JSON.stringify({
        date: new Date().toISOString(),
        view: 'day'
      })
    });
    console.log('✅ Day view data:', dayData);
    
    console.log('🎉 All calendar tests passed!');
  } catch (error) {
    console.error('❌ Calendar test failed:', error);
  }
};

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  testCalendar();
}

export default testCalendar;
