import verifiedApiUrl from './verify-api-url';

// API Configuration for Render + Cloudflare R2
const API_CONFIG = {
  // Production API URL (Render backend with R2)
  PRODUCTION_API_URL: 'https://oceansmov-backend.onrender.com/api',
  // Development API URL
  DEVELOPMENT_API_URL: 'http://localhost:5000/api',
  
  // Get the appropriate URL based on environment
  getApiUrl: () => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://oceansmov-backend.onrender.com/api';
    }
    // Use the verified API URL for development
    return verifiedApiUrl;
  },
  
  // R2 Configuration (for reference)
  R2_CONFIG: {
    // These are handled by the backend, but good to know for debugging
    STORAGE_PROVIDER: 'Cloudflare R2',
    FEATURES: [
      'No egress fees',
      'Global CDN',
      'Signed URLs for secure access',
      'Direct public URLs for posters'
    ]
  }
};

export default API_CONFIG; 