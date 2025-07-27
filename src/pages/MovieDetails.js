import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, fetchReviews, addReview, getFileUrl } from '../services/api';
import ReviewList from '../components/ReviewList';
import AddReviewForm from '../components/AddReviewForm';
import VideoPlayer from '../components/VideoPlayer';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [movieRes, reviewsRes] = await Promise.all([
          fetchMovieDetails(id),
          fetchReviews(id)
        ]);
        setMovie(movieRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error loading movie:', err);
        setError('Failed to load movie.');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAddReview = async ({ rating, comment }) => {
    setReviewLoading(true);
    setError('');
    try {
      await addReview({ movie_id: id, rating, comment });
      const reviewsRes = await fetchReviews(id);
      setReviews(reviewsRes.data);
    } catch (err) {
      setError('Failed to add review.');
    }
    setReviewLoading(false);
  };

  const handlePlayerReady = (player) => {
    console.log('Video player is ready');
  };

  const handlePlayerPlay = () => {
    console.log('Video started playing');
  };

  const handlePlayerPause = () => {
    console.log('Video paused');
  };

  const handlePlayerEnded = () => {
    console.log('Video ended');
  };

  const handleTimeUpdate = (currentTime) => {
    // Optional: Track viewing progress
  };

  const handleVolumeChange = (volume) => {
    console.log(`Volume changed to: ${Math.round(volume * 100)}%`);
  };

  const handleQualityChange = (qualityLevel) => {
    console.log(`Quality changed to: ${qualityLevel.width}x${qualityLevel.height}`);
  };

  if (loading) return <div className="movie-details-container"><p>Loading...</p></div>;
  if (!movie) return <div className="movie-details-container"><p>{error || 'Movie not found.'}</p></div>;

  const videoUrl = movie.movie_file_url ? getFileUrl(movie.movie_file_url) : null;
  const posterUrl = movie.poster_url ? getFileUrl(movie.poster_url) : null;

  return (
    <div className="movie-details-container">
      {/* Video Player Section */}
      {movie.movie_file_url && (
        <div className="video-section">
          <VideoPlayer
            key={videoUrl} // Force recreation when video URL changes
            src={videoUrl}
            title={movie.title}
            poster={posterUrl}
            onReady={handlePlayerReady}
            onPlay={handlePlayerPlay}
            onPause={handlePlayerPause}
            onEnded={handlePlayerEnded}
            onTimeUpdate={handleTimeUpdate}
            onVolumeChange={handleVolumeChange}
            onQualityChange={handleQualityChange}
            autoPlay={false}
            muted={false}
            preload="metadata"
          />
        </div>
      )}
      
      {/* Movie Info Section */}
      <div className="movie-info-section">
        <div className="movie-details-header">
          <div className="movie-poster-section">
            <img
              src={movie.poster_url ? getFileUrl(movie.poster_url) : '/default-poster.png'}
              alt={movie.title}
              className="movie-details-poster"
              onError={(e) => {
                e.target.src = '/default-poster.png';
              }}
            />
          </div>
          <div className="movie-details-info">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              <span className="movie-year">{movie.release_year}</span>
              <span className="movie-genre">{movie.genre}</span>
            </div>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews & Ratings</h2>
        <ReviewList reviews={reviews} />
        {user && (
          <AddReviewForm onSubmit={handleAddReview} loading={reviewLoading} />
        )}
      </div>
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MovieDetails; 