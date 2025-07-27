import React, { useState } from 'react';
import './MovieForm.css';

const MovieForm = ({ initial, onSubmit, loading }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [release_year, setReleaseYear] = useState(initial?.release_year || '');
  const [genre, setGenre] = useState(initial?.genre || '');
  const [poster, setPoster] = useState(null);
  const [movieFile, setMovieFile] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ title, description, release_year, genre, poster, movieFile });
  };

  return (
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
        <label htmlFor="movieFile">Movie File</label>
        <input 
          id="movieFile"
          type="file" 
          accept="video/*,.mp4,.avi,.mov,.mkv,.webm" 
          onChange={e => setMovieFile(e.target.files[0])} 
        />
        <small className="file-info">Supported formats: MP4, AVI, MOV, MKV, WebM (Max 500MB)</small>
      </div>
      
      <div className="form-field">
        <label htmlFor="poster">Poster</label>
        <input 
          id="poster"
          type="file" 
          accept="image/*" 
          onChange={e => setPoster(e.target.files[0])} 
        />
        <small className="file-info">Movie poster image (JPG, PNG, WebP)</small>
      </div>
      
      {initial?.poster_url && (
        <div className="form-field">
          <label>Current Poster</label>
          <img src={initial.poster_url} alt="Current Poster" className="movie-form-poster" />
        </div>
      )}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Movie'}
      </button>
    </form>
  );
};

export default MovieForm; 