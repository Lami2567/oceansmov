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

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to get full URL for files
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  // For production, use the same domain as the API
  const baseUrl = API_CONFIG.getApiUrl().replace('/api', '');
  return `${baseUrl}${filePath}`;
};

// Helper function to get signed URL for video files
export const getSignedVideoUrl = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token found, using direct URL');
      return null;
    }
    
    const response = await api.get(`/movies/${movieId}/video-url`);
    if (response.data && response.data.signed_url) {
      console.log('✅ Signed URL generated for video playback');
      return response.data.signed_url;
    }
    return null;
  } catch (error) {
    console.warn('Failed to get signed URL, using direct URL:', error.message);
    return null;
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

// Upload movie poster with progress tracking
export const uploadPoster = async (movieId, posterFile, onProgress) => {
  const formData = new FormData();
  formData.append('poster', posterFile);
  return api.post(`/movies/${movieId}/poster`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  });
};

// Upload movie file with progress tracking
export const uploadMovieFile = async (movieId, movieFile, onProgress) => {
  const formData = new FormData();
  formData.append('movieFile', movieFile);
  return api.post(`/movies/${movieId}/movie`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  });
};

// Auth
export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);

// Reviews
export const fetchReviews = (movieId) => api.get(`/reviews/movie/${movieId}`);
export const addReview = (data) => api.post('/reviews', data);
export const approveReview = (id) => api.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api; 