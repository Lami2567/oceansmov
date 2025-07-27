import React from 'react';
import { Link } from 'react-router-dom';
import { getFileUrl } from '../services/api';
import './MovieCard.css';

const MovieCard = ({ movie }) => (
  <div className="movie-card">
    <Link to={`/movie/${movie.id}`}>
      <img
        src={movie.poster_url ? getFileUrl(movie.poster_url) : '/default-poster.png'}
        alt={movie.title}
        className="movie-poster"
        onError={(e) => {
          e.target.src = '/default-poster.png';
        }}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_year} &bull; {movie.genre}</p>
      </div>
    </Link>
  </div>
);

export default MovieCard; 