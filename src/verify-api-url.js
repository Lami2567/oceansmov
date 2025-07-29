// Build-time verification of API URL
const API_URL = process.env.REACT_APP_API_URL;

console.log('🔍 Build-time API URL verification:');
console.log('Environment:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', API_URL);

if (process.env.NODE_ENV === 'production') {
  if (!API_URL || API_URL.includes('your-render-app')) {
    console.error('❌ ERROR: Invalid API URL detected!');
    console.error('Expected: https://oceansmov-backend.onrender.com/api');
    console.error('Found:', API_URL);
    console.error('Please set REACT_APP_API_URL in Vercel environment variables');
    process.exit(1);
  } else {
    console.log('✅ Valid API URL detected:', API_URL);
  }
}

export default API_URL || 'http://localhost:5000/api'; 