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

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await fetchMovies();
      setMovies(res.data);
    } catch (err) {
      setError('Failed to load movies');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      setMovies(movies.filter(m => m.id !== id));
    } catch {
      alert('Failed to delete movie');
    }
  };

  const handleAddMovie = async (data) => {
    setFormLoading(true);
    setFormError('');
    setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    
    try {
      const res = await createMovie(data);
      let movie = res.data;
      
      // Upload poster if provided
      if (data.poster) {
        setUploadProgress(prev => ({ ...prev, isUploading: true, poster: 0 }));
        const posterRes = await uploadPoster(
          movie.id, 
          data.poster, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, poster: progress }));
          }
        );
        movie = { ...movie, poster_url: posterRes.data.poster_url };
      }
      
      // Upload movie file if provided
      if (data.movieFile) {
        setUploadProgress(prev => ({ ...prev, isUploading: true, movie: 0 }));
        const movieRes = await uploadMovieFile(
          movie.id, 
          data.movieFile, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, movie: progress }));
          }
        );
        movie = { ...movie, movie_file_url: movieRes.data.movie_file_url };
      }
      
      setMovies([movie, ...movies]);
      setShowForm(false);
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    } catch (err) {
      setFormError('Failed to add movie');
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    }
    setFormLoading(false);
  };

  const handleEditMovie = async (data) => {
    setFormLoading(true);
    setFormError('');
    setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    
    try {
      const res = await updateMovie(editMovie.id, data);
      let movie = res.data;
      
      // Upload poster if provided
      if (data.poster) {
        setUploadProgress(prev => ({ ...prev, isUploading: true, poster: 0 }));
        const posterRes = await uploadPoster(
          movie.id, 
          data.poster, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, poster: progress }));
          }
        );
        movie = { ...movie, poster_url: posterRes.data.poster_url };
      }
      
      // Upload movie file if provided
      if (data.movieFile) {
        setUploadProgress(prev => ({ ...prev, isUploading: true, movie: 0 }));
        const movieRes = await uploadMovieFile(
          movie.id, 
          data.movieFile, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, movie: progress }));
          }
        );
        movie = { ...movie, movie_file_url: movieRes.data.movie_file_url };
      }
      
      setMovies(movies.map(m => m.id === movie.id ? movie : m));
      setEditMovie(null);
      setShowForm(false);
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    } catch (err) {
      setFormError('Failed to update movie');
      setUploadProgress({ poster: 0, movie: 0, isUploading: false });
    }
    setFormLoading(false);
  };

  return (
    <div className="admin-movies">
      <h2>Manage Movies</h2>
      <button className="add-movie-btn" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Movie'}</button>
      {showForm && !editMovie && <MovieForm onSubmit={handleAddMovie} loading={formLoading} />}
      {editMovie && <MovieForm initial={editMovie} onSubmit={handleEditMovie} loading={formLoading} />}
      
      {/* Upload Progress Display */}
      {uploadProgress.isUploading && (
        <div className="upload-progress-container">
          <h3>Upload Progress</h3>
          {uploadProgress.poster > 0 && (
            <div className="progress-item">
              <label>Poster Upload:</label>
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
              <label>Movie Upload:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill movie-progress" 
                  style={{ width: `${uploadProgress.movie}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress.movie}%</span>
            </div>
          )}
        </div>
      )}
      
      {formError && <p className="admin-error">{formError}</p>}
      {loading ? <p>Loading...</p> : (
        <table className="admin-movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Files</th>
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
                  {movie.poster_url && <span className="file-badge poster">Poster</span>}
                  {movie.movie_file_url && <span className="file-badge movie">Movie</span>}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => { setEditMovie(movie); setShowForm(false); }}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(movie.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
};

export default AdminMovies; 