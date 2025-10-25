// Test timezone utility functions
import { getUserTimezone, formatDateForDisplay } from './utils/timezone.js';

console.log('🧪 Testing timezone utilities...');

try {
  // Test getUserTimezone
  const userTimezone = getUserTimezone();
  console.log('✅ getUserTimezone():', userTimezone);
  
  // Test formatDateForDisplay
  const testDate = new Date();
  const formatted = formatDateForDisplay(testDate, userTimezone, 'date');
  console.log('✅ formatDateForDisplay():', formatted);
  
  console.log('🎉 All timezone tests passed!');
} catch (error) {
  console.error('❌ Timezone test failed:', error);
}
