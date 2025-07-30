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
  const [urlType, setUrlType] = useState(''); // 'signed' or 'direct'
  const [storageInfo, setStorageInfo] = useState(''); // R2 storage info

  // DEPLOYMENT TEST - This should appear in console if new code is deployed
  console.log('🚀 DEPLOYMENT TEST: MovieDetails component loaded - R2 CONFIGURED!');
  console.log('📅 Deployment timestamp:', new Date().toISOString());
  console.log('☁️ Storage: Cloudflare R2');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 MovieDetails: Checking authentication...');
    console.log('🎫 Token exists:', !!token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('👤 User payload:', payload);
        setUser(payload);
      } catch (error) {
        console.error('❌ Error parsing token:', error);
      }
    } else {
      console.log('❌ No token found in localStorage');
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      console.log('🚀 MovieDetails: Starting to load movie data from R2 backend...');
      setLoading(true);
      try {
        const [movieRes, reviewsRes] = await Promise.all([
          fetchMovieDetails(id),
          fetchReviews(id)
        ]);
        
        console.log('📽️ Movie data loaded:', movieRes.data);
        const movieData = movieRes.data.data || movieRes.data; // Handle nested data structure
        setMovie(movieData);
        setReviews(reviewsRes.data);
        
        // Get video URL for playback
        if (movieData.movie_file_url) {
          console.log('🎬 Movie has video file, setting up R2 video playback...');
          console.log('🔗 R2 URL:', movieData.movie_file_url);
          
          // Check if it's an R2 URL
          if (movieData.movie_file_url.includes('r2.dev') || movieData.movie_file_url.includes('cloudflare')) {
            setStorageInfo('☁️ Cloudflare R2 Storage');
            console.log('☁️ Confirmed: Video stored in Cloudflare R2');
          }
          
          // For R2 videos, use direct URLs for public access
          // Signed URLs are only needed for private content
          const directUrl = getFileUrl(movieData.movie_file_url);
          console.log('🔗 Using direct R2 URL for public access:', directUrl);
          setVideoUrl(directUrl);
          setUrlType('direct');
        } else {
          console.log('❌ No video file found for this movie');
          console.log('🔍 Available movie properties:', Object.keys(movieData));
        }
      } catch (err) {
        console.error('Error loading movie:', err);
        setError('Failed to load movie.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddReview = async ({ rating, comment }) => {
    setReviewLoading(true);
    try {
      const response = await addReview({
        movie_id: id,
        rating,
        comment
      });
      setReviews([...reviews, response.data]);
      setReviewLoading(false);
    } catch (err) {
      console.error('Error adding review:', err);
      setReviewLoading(false);
    }
  };

  const handlePlayerReady = (player) => {
    console.log('🎬 Video player ready for R2 content');
    console.log('🔗 Video URL type:', urlType);
    console.log('☁️ Storage:', storageInfo);
  };

  const handlePlayerPlay = () => {
    console.log('▶️ Video started playing from R2');
  };

  const handlePlayerPause = () => {
    console.log('⏸️ Video paused');
  };

  const handlePlayerEnded = () => {
    console.log('🏁 Video ended');
  };

  const handleTimeUpdate = (currentTime) => {
    // Optional: Track playback progress
  };

  const handleVolumeChange = (volume) => {
    // Optional: Track volume changes
  };

  const handleQualityChange = (qualityLevel) => {
    console.log('🎛️ Quality changed to:', qualityLevel);
  };

  if (loading) {
    return (
      <div className="movie-details-container">
        <div className="loading">Loading movie details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-container">
        <div className="error">Movie not found.</div>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      <div className="movie-header">
        <h1>{movie.title}</h1>
        {storageInfo && (
          <div className="storage-info">
            <span className="storage-badge">{storageInfo}</span>
            {urlType === 'signed' && <span className="security-badge">🔐 Secure Access</span>}
          </div>
        )}
      </div>
      
      {/* Video Player Section - Top Priority */}
      {videoUrl && (
        <div className="video-section-top">
          <VideoPlayer
            src={videoUrl}
            poster={getFileUrl(movie.poster_url)}
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
          />
        </div>
      )}
      
      <div className="movie-content">
        <div className="movie-poster">
          {movie.poster_url ? (
            <img 
              src={getFileUrl(movie.poster_url)} 
              alt={movie.title}
              onError={(e) => {
                console.log('❌ Poster image failed to load from R2');
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="no-poster">No poster available</div>
          )}
        </div>
        
        <div className="movie-info">
          <p><strong>Year:</strong> {movie.release_year}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Description:</strong> {movie.description}</p>
        </div>
      </div>
      
      <div className="reviews-section">
        <h3>Reviews</h3>
        {user && <AddReviewForm onSubmit={handleAddReview} loading={reviewLoading} />}
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default MovieDetails; 