import React, { useEffect, useState } from 'react';
import { fetchMovies, deleteMovie } from '../services/api';
import './AdminMovies.css';
import MovieForm from './MovieForm';
import { createMovie, uploadPoster, uploadMovieFile, updateMovie } from '../services/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [editMovie, setEditMovie] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    poster: 0,
    movie: 0,
    isUploading: false
  });

  // R2 Storage Info
  const [storageInfo, setStorageInfo] = useState({
    provider: 'Cloudflare R2',
    features: ['No egress fees', 'Global CDN', 'Unlimited streaming']
  });

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await fetchMovies();
      setMovies(res.data.data || res.data || []);
      console.log('📽️ Loaded movies from R2 backend');
    } catch (err) {
      setError('Failed to load movies');
      console.error('❌ Error loading movies:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMovies();
    console.log('☁️ AdminMovies: Ready for R2 storage operations');
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie? This will also remove files from R2 storage.')) return;
    try {
      await deleteMovie(id);
      setMovies(movies.filter(m => m.id !== id));
      console.log('🗑️ Movie deleted from R2 storage');
    } catch (err) {
      alert('Failed to delete movie');
      console.error('❌ Error deleting movie:', err);
    }
  };

  const handleAddMovie = async (data) => {
    setFormLoading(true);
    setFormError('');
    setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    
    console.log('🎬 Starting movie creation with R2 uploads...');
    
    try {
      const res = await createMovie(data);
      let movie = res.data;
      console.log('✅ Movie created, ID:', movie.id);
      
      // Upload poster to R2 if provided
      if (data.poster) {
        console.log('📤 Uploading poster to R2...');
        setUploadProgress(prev => ({ ...prev, isUploading: true, poster: 0 }));
        const posterRes = await uploadPoster(
          movie.id, 
          data.poster, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, poster: progress }));
            console.log(`📤 Poster upload progress: ${progress}%`);
          }
        );
        movie = { ...movie, poster_url: posterRes.data.poster_url };
        console.log('✅ Poster uploaded to R2:', posterRes.data.poster_url);
      }
      
      // Upload movie file to R2 if provided
      if (data.movieFile) {
        console.log('📤 Uploading movie file to R2...');
        console.log('📁 File:', data.movieFile.name, 'Size:', data.movieFile.size);
        setUploadProgress(prev => ({ ...prev, isUploading: true, movie: 0 }));
        const movieRes = await uploadMovieFile(
          movie.id, 
          data.movieFile, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, movie: progress }));
            console.log(`📤 Movie upload progress: ${progress}%`);
          }
        );
        movie = { ...movie, movie_file_url: movieRes.data.movie_file_url };
        console.log('✅ Movie file uploaded to R2:', movieRes.data.movie_file_url);
      }
      
      setMovies([movie, ...movies]);
      setShowForm(false);
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
      console.log('🎉 Movie successfully added with R2 storage!');
    } catch (err) {
      setFormError('Failed to add movie');
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
      console.error('❌ Error adding movie:', err);
    }
    setFormLoading(false);
  };

  const handleEditMovie = async (data) => {
    setFormLoading(true);
    setFormError('');
    setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    
    console.log('✏️ Starting movie update with R2 uploads...');
    
    try {
      const res = await updateMovie(editMovie.id, data);
      let movie = res.data;
      console.log('✅ Movie updated, ID:', movie.id);
      
      // Upload poster to R2 if provided
      if (data.poster) {
        console.log('📤 Uploading new poster to R2...');
        setUploadProgress(prev => ({ ...prev, isUploading: true, poster: 0 }));
        const posterRes = await uploadPoster(
          movie.id, 
          data.poster, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, poster: progress }));
            console.log(`📤 Poster upload progress: ${progress}%`);
          }
        );
        movie = { ...movie, poster_url: posterRes.data.poster_url };
        console.log('✅ New poster uploaded to R2:', posterRes.data.poster_url);
      }
      
      // Upload movie file to R2 if provided
      if (data.movieFile) {
        console.log('📤 Uploading new movie file to R2...');
        console.log('📁 File:', data.movieFile.name, 'Size:', data.movieFile.size);
        setUploadProgress(prev => ({ ...prev, isUploading: true, movie: 0 }));
        const movieRes = await uploadMovieFile(
          movie.id, 
          data.movieFile, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, movie: progress }));
            console.log(`📤 Movie upload progress: ${progress}%`);
          }
        );
        movie = { ...movie, movie_file_url: movieRes.data.movie_file_url };
        console.log('✅ New movie file uploaded to R2:', movieRes.data.movie_file_url);
      }
      
      setMovies(movies.map(m => m.id === movie.id ? movie : m));
      setEditMovie(null);
      setShowForm(false);
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
      console.log('🎉 Movie successfully updated with R2 storage!');
    } catch (err) {
      setFormError('Failed to update movie');
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
      console.error('❌ Error updating movie:', err);
    }
    setFormLoading(false);
  };

  return (
    <div className="admin-movies">
      <div className="admin-header">
        <h2>Manage Movies</h2>
        <div className="storage-info">
          <span className="storage-badge">☁️ {storageInfo.provider}</span>
          <div className="storage-features">
            {storageInfo.features.map((feature, index) => (
              <span key={index} className="feature-badge">{feature}</span>
            ))}
          </div>
        </div>
      </div>
      
      <button className="add-movie-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add Movie to R2'}
      </button>
      
      {showForm && !editMovie && <MovieForm onSubmit={handleAddMovie} loading={formLoading} />}
      {editMovie && <MovieForm initial={editMovie} onSubmit={handleEditMovie} loading={formLoading} />}
      
      {/* Enhanced Upload Progress Display */}
      {uploadProgress.isUploading && (
        <div className="upload-progress-container">
          <h3>☁️ R2 Upload Progress</h3>
          {uploadProgress.poster > 0 && (
            <div className="progress-item">
              <label>📤 Poster Upload to R2:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill poster-progress" 
                  style={{ width: `${uploadProgress.poster}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress.poster}%</span>
            </div>
          )}
          {uploadProgress.movie > 0 && (
            <div className="progress-item">
              <label>📤 Movie Upload to R2:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill movie-progress" 
                  style={{ width: `${uploadProgress.movie}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress.movie}%</span>
            </div>
          )}
          <div className="upload-info">
            <small>💡 Files are being uploaded directly to Cloudflare R2 for optimal performance</small>
          </div>
        </div>
      )}
      
      {formError && <p className="admin-error">{formError}</p>}
      
      {loading ? (
        <div className="loading-container">
          <p>Loading movies from R2...</p>
        </div>
      ) : (
        <table className="admin-movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Genre</th>
              <th>R2 Files</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.release_year}</td>
                <td>{movie.genre}</td>
                <td>
                  {movie.poster_url && (
                    <span className="file-badge poster" title="Stored in R2">
                      📸 Poster
                    </span>
                  )}
                  {movie.movie_file_url && (
                    <span className="file-badge movie" title="Stored in R2">
                      🎬 Movie
                    </span>
                  )}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => { setEditMovie(movie); setShowForm(false); }}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(movie.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {error && <p className="admin-error">{error}</p>}
      
      {movies.length === 0 && !loading && (
        <div className="empty-state">
          <p>No movies found. Add your first movie to start using R2 storage!</p>
        </div>
      )}
    </div>
  );
};

export default AdminMovies; 