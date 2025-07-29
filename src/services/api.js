import axios from 'axios';
import API_CONFIG from '../config';

const API_BASE_URL = API_CONFIG.getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('📡 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('☁️ Storage Provider:', API_CONFIG.R2_CONFIG.STORAGE_PROVIDER);

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to get full URL for files (optimized for R2)
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If it's already a full URL (R2 URLs are full URLs), return as is
  if (filePath.startsWith('http')) {
    console.log('🔗 Using direct R2 URL:', filePath);
    return filePath;
  }
  
  // For legacy local files (fallback)
  const baseUrl = API_CONFIG.getApiUrl().replace('/api', '');
  return `${baseUrl}${filePath}`;
};

// Enhanced helper function to get signed URL for video files (R2 optimized)
export const getSignedVideoUrl = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Checking authentication for R2 signed URL...');
    console.log('🎫 Token exists:', !!token);
    
    if (!token) {
      console.log('❌ No auth token found, cannot get R2 signed URL');
      return null;
    }
    
    console.log('🔗 Requesting R2 signed URL from backend...');
    const response = await api.get(`/movies/${movieId}/video-url`);
    
    console.log('📡 Backend response status:', response.status);
    console.log('📡 Backend response data:', response.data);
    
    if (response.data && response.data.signed_url) {
      console.log('✅ R2 signed URL generated successfully!');
      console.log('🔗 Signed URL length:', response.data.signed_url.length);
      console.log('⏰ Expires in:', response.data.expires_in, 'seconds');
      
      // Check if it's an R2 URL
      if (response.data.signed_url.includes('r2.dev') || response.data.signed_url.includes('cloudflare')) {
        console.log('☁️ Confirmed: Using Cloudflare R2 signed URL');
      }
      
      return response.data.signed_url;
    } else {
      console.log('❌ No signed URL in response');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting R2 signed URL:', error);
    console.error('❌ Error details:', error.response?.data || error.message);
    
    // Check if it's an authentication error
    if (error.response?.status === 401) {
      console.log('🔐 Authentication required for R2 signed URLs');
    } else if (error.response?.status === 404) {
      console.log('📹 Video file not found in R2');
    }
    
    return null;
  }
};

// Enhanced file upload functions for R2
export const uploadPoster = async (movieId, posterFile, onProgress) => {
  console.log('📤 Uploading poster to R2...');
  console.log('📁 File:', posterFile.name, 'Size:', posterFile.size);
  
  const formData = new FormData();
  formData.append('poster', posterFile);
  
  try {
    const response = await api.post(`/movies/${movieId}/poster`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    
    console.log('✅ Poster uploaded to R2 successfully!');
    console.log('🔗 R2 URL:', response.data.poster_url);
    return response;
  } catch (error) {
    console.error('❌ Error uploading poster to R2:', error);
    throw error;
  }
};

// Enhanced movie file upload for R2
export const uploadMovieFile = async (movieId, movieFile, onProgress) => {
  console.log('📤 Uploading movie file to R2...');
  console.log('📁 File:', movieFile.name, 'Size:', movieFile.size);
  console.log('🎬 File type:', movieFile.type);
  
  const formData = new FormData();
  formData.append('movieFile', movieFile);
  
  try {
    const response = await api.post(`/movies/${movieId}/movie`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    
    console.log('✅ Movie file uploaded to R2 successfully!');
    console.log('🔗 R2 URL:', response.data.movie_file_url);
    return response;
  } catch (error) {
    console.error('❌ Error uploading movie file to R2:', error);
    throw error;
  }
};

// Movies with enhanced search and filtering
export const fetchMovies = (params = {}) => api.get('/movies', { params });
export const fetchMovieDetails = (id) => api.get(`/movies/${id}`);
export const createMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// Search and filter specific functions
export const searchMovies = (searchTerm, filters = {}) => {
  const params = { search: searchTerm, ...filters };
  return api.get('/movies', { params });
};

export const filterMovies = (filters = {}) => {
  return api.get('/movies', { params: filters });
};

// Get available genres and years for filters
export const fetchGenres = () => api.get('/movies/genres');
export const fetchYears = () => api.get('/movies/years');

// Auth
export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);

// Reviews
export const fetchReviews = (movieId) => api.get(`/reviews/movie/${movieId}`);
export const addReview = (data) => api.post('/reviews', data);
export const approveReview = (id) => api.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api; 