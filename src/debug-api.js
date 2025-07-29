// Debug script to show API configuration
console.log('🔍 API Debug Information:');
console.log('========================');

// Show all environment variables
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Show the actual API URL being used
import API_CONFIG from './config';
const apiUrl = API_CONFIG.getApiUrl();
console.log('- Actual API URL:', apiUrl);

// Test if the URL is correct
const isCorrectUrl = apiUrl === 'https://oceansmov-backend.onrender.com/api';
console.log('- Is URL correct?', isCorrectUrl);

// Show what the frontend will try to connect to
console.log('🎯 Frontend will connect to:', apiUrl);

// If URL is wrong, show what it should be
if (!isCorrectUrl) {
  console.error('❌ WRONG URL DETECTED!');
  console.error('Expected: https://oceansmov-backend.onrender.com/api');
  console.error('Found:', apiUrl);
  console.error('Please check Vercel environment variables');
}

export default apiUrl; 