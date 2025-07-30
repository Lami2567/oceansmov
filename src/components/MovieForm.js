import React, { useState } from 'react';
import './MovieForm.css';

const MovieForm = ({ initial, onSubmit, loading }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [release_year, setReleaseYear] = useState(initial?.release_year || '');
  const [genre, setGenre] = useState(initial?.genre || '');
  const [poster, setPoster] = useState(null);
  const [movieFile, setMovieFile] = useState(null);
  const [fileInfo, setFileInfo] = useState({
    poster: null,
    movie: null
  });

  // R2 Storage Configuration
  const r2Config = {
    maxMovieSize: 500 * 1024 * 1024, // 500MB
    maxPosterSize: 5 * 1024 * 1024, // 5MB
    supportedVideoFormats: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska', 'video/webm'],
    supportedImageFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  };

  const validateFile = (file, type) => {
    const errors = [];
    
    if (type === 'movie') {
      if (file.size > r2Config.maxMovieSize) {
        errors.push(`Movie file too large. Maximum size is ${r2Config.maxMovieSize / (1024 * 1024)}MB`);
      }
      if (!r2Config.supportedVideoFormats.includes(file.type)) {
        errors.push('Unsupported video format. Please use MP4, AVI, MOV, MKV, or WebM');
      }
    } else if (type === 'poster') {
      if (file.size > r2Config.maxPosterSize) {
        errors.push(`Poster file too large. Maximum size is ${r2Config.maxPosterSize / (1024 * 1024)}MB`);
      }
      if (!r2Config.supportedImageFormats.includes(file.type)) {
        errors.push('Unsupported image format. Please use JPG, PNG, WebP, or GIF');
      }
    }
    
    return errors;
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const errors = validateFile(file, type);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      e.target.value = '';
      return;
    }

    // Update file state
    if (type === 'movie') {
      setMovieFile(file);
      setFileInfo(prev => ({
        ...prev,
        movie: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
    } else {
      setPoster(file);
      setFileInfo(prev => ({
        ...prev,
        poster: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('🎬 Submitting movie form for R2 upload...');
    onSubmit({ title, description, release_year, genre, poster, movieFile });
  };

  return (
    <div className="movie-form-container">
      <div className="r2-info">
        <h3>☁️ Cloudflare R2 Storage</h3>
        <div className="r2-features">
          <span className="feature">🚀 No egress fees</span>
          <span className="feature">🌍 Global CDN</span>
          <span className="feature">⚡ Fast uploads</span>
        </div>
      </div>

      <form className="movie-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input 
            id="title"
            type="text"
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Enter movie title"
            required 
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter movie description"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="year">Year</label>
          <input 
            id="year"
            type="number" 
            value={release_year} 
            onChange={e => setReleaseYear(e.target.value)}
            placeholder="Enter release year"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="genre">Genre</label>
          <input 
            id="genre"
            type="text"
            value={genre} 
            onChange={e => setGenre(e.target.value)}
            placeholder="Enter movie genre"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="movieFile">🎬 Movie File (R2 Storage)</label>
          <input 
            id="movieFile"
            type="file" 
            accept="video/*,.mp4,.avi,.mov,.mkv,.webm" 
            onChange={e => handleFileChange(e, 'movie')} 
          />
          <div className="file-info">
            <small>
              📁 Supported: MP4, AVI, MOV, MKV, WebM | 
              📏 Max: {r2Config.maxMovieSize / (1024 * 1024)}MB | 
              ☁️ Stored in R2
            </small>
          </div>
          {fileInfo.movie && (
            <div className="file-details">
              <span className="file-name">📁 {fileInfo.movie.name}</span>
              <span className="file-size">📏 {formatFileSize(fileInfo.movie.size)}</span>
              <span className="file-type">🎬 {fileInfo.movie.type}</span>
            </div>
          )}
        </div>
        
        <div className="form-field">
          <label htmlFor="poster">📸 Poster Image (R2 Storage)</label>
          <input 
            id="poster"
            type="file" 
            accept="image/*" 
            onChange={e => handleFileChange(e, 'poster')} 
          />
          <div className="file-info">
            <small>
              📁 Supported: JPG, PNG, WebP, GIF | 
              📏 Max: {r2Config.maxPosterSize / (1024 * 1024)}MB | 
              ☁️ Stored in R2
            </small>
          </div>
          {fileInfo.poster && (
            <div className="file-details">
              <span className="file-name">📁 {fileInfo.poster.name}</span>
              <span className="file-size">📏 {formatFileSize(fileInfo.poster.size)}</span>
              <span className="file-type">🖼️ {fileInfo.poster.type}</span>
            </div>
          )}
        </div>
        
        {initial?.poster_url && (
          <div className="form-field">
            <label>Current Poster (R2)</label>
            <div className="current-poster">
              <img src={initial.poster_url} alt="Current Poster" className="movie-form-poster" />
              <small>☁️ Currently stored in Cloudflare R2</small>
            </div>
          </div>
        )}
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? '☁️ Uploading to R2...' : '💾 Save Movie to R2'}
        </button>
      </form>
    </div>
  );
};

export default MovieForm; 