import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, fetchReviews, addReview, getFileUrl, getSignedVideoUrl } from '../services/api';
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
  const [videoUrl, setVideoUrl] = useState(null);

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
        
        // Get signed URL for video if available
        if (movieRes.data.movie_file_url) {
          try {
            const signedUrl = await getSignedVideoUrl(id);
            if (signedUrl) {
              console.log('🎬 Using signed URL for video playback');
              setVideoUrl(signedUrl);
            } else {
              console.log('🎬 Using direct URL for video playback');
              setVideoUrl(getFileUrl(movieRes.data.movie_file_url));
            }
          } catch (error) {
            console.warn('Failed to get signed URL, using direct URL:', error);
            setVideoUrl(getFileUrl(movieRes.data.movie_file_url));
          }
        }
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

  const posterUrl = movie.poster_url ? getFileUrl(movie.poster_url) : null;

  return (
    <div className="movie-details-container">
      {/* Video Player Section */}
      {movie.movie_file_url && videoUrl && (
        <div className="video-section">
          <VideoPlayer
            key={videoUrl} // Force recreation when video URL changes
            src={videoUrl}
            poster={posterUrl}
            title={movie.title}
            onReady={handlePlayerReady}
            onPlay={handlePlayerPlay}
            onPause={handlePlayerPause}
            onEnded={handlePlayerEnded}
            onTimeUpdate={handleTimeUpdate}
            onVolumeChange={handleVolumeChange}
            onQualityChange={handleQualityChange}
            autoPlay={false}
            muted={true}
            preload="metadata"
          />
        </div>
      )}

      {/* Movie Information */}
      <div className="movie-info">
        <div className="movie-header">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="year">{movie.release_year}</span>
            <span className="genre">{movie.genre}</span>
            <span className="director">Director: {movie.director}</span>
          </div>
        </div>
        
        <div className="movie-description">
          <p>{movie.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {user && (
          <AddReviewForm 
            onSubmit={handleAddReview} 
            loading={reviewLoading}
          />
        )}
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default MovieDetails; 