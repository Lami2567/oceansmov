import verifiedApiUrl from './verify-api-url';

// API Configuration
const API_CONFIG = {
  // Production API URL
  PRODUCTION_API_URL: 'https://oceansmov-backend.onrender.com/api',
  // Development API URL
  DEVELOPMENT_API_URL: 'http://localhost:5000/api',
  // Get the appropriate URL based on environment
  getApiUrl: () => {
    // TEMPORARY: Force the correct URL for debugging
    if (process.env.NODE_ENV === 'production') {
      return 'https://oceansmov-backend.onrender.com/api';
    }
    // Use the verified API URL for development
    return verifiedApiUrl;
  }
};

export default API_CONFIG; 