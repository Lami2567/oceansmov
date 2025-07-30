import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css';

// Helper function to determine video type from URL
const getVideoType = (src) => {
  if (!src) return 'video/mp4';
  
  const url = src.toLowerCase();
  if (url.includes('.mp4')) return 'video/mp4';
  if (url.includes('.webm')) return 'video/webm';
  if (url.includes('.ogg')) return 'video/ogg';
  if (url.includes('.avi')) return 'video/avi';
  if (url.includes('.mov')) return 'video/quicktime';
  if (url.includes('.mkv')) return 'video/x-matroska';
  
  // Default to mp4 if no extension found
  return 'video/mp4';
};

const VideoPlayer = ({ 
  src, 
  poster, 
  title, 
  onReady, 
  onPlay, 
  onPause, 
  onEnded, 
  onTimeUpdate, 
  onVolumeChange, 
  onQualityChange,
  autoPlay = false,
  muted = true,
  preload = 'metadata'
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('VideoPlayer useEffect - src:', src, 'videoRef:', !!videoRef.current);
    
    if (!videoRef.current || !src) {
      console.log('Missing videoRef or src, skipping initialization');
      return;
    }

    console.log('Starting Video.js initialization...');

    // Dispose any existing player
    if (playerRef.current) {
      console.log('Disposing existing player');
      try {
        playerRef.current.dispose();
      } catch (err) {
        console.error('Error disposing player:', err);
      }
      playerRef.current = null;
    }

    // Wait a bit for DOM to be ready
    setTimeout(() => {
      if (!videoRef.current) {
        console.log('Video element no longer available');
        return;
      }

      console.log('Creating Video.js player...');
      
      try {
        // Create player with explicit settings
        const player = videojs(videoRef.current, {
          controls: true,
          responsive: true,
          fluid: true,
          preload: preload,
          autoplay: autoPlay,
          muted: muted,
          poster: poster,
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
          controlBar: {
            children: [
              'playToggle',
              'volumePanel',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
              'progressControl',
              'playbackRateMenuButton',
              'fullscreenToggle'
            ]
          }
        });

        console.log('Video.js player created successfully');
        playerRef.current = player;

        // Set up event listeners
        player.ready(() => {
          console.log('Video player is ready');
          setIsPlayerReady(true);
          
          // Set the source after player is ready
          // Determine video type from URL or use default
          const videoType = getVideoType(src);
          player.src({
            src: src,
            type: videoType
          });
          
          console.log('Video source set to:', src);
          
          // Force player to show controls
          player.controlBar.show();
          
          if (onReady) onReady(player);
        });

        player.on('play', () => {
          console.log('Video started playing');
          setError(null);
          
          // Hide the big play button when video starts playing
          const bigPlayButton = player.el().querySelector('.vjs-big-play-button');
          if (bigPlayButton) {
            bigPlayButton.style.display = 'none';
          }
          
          if (onPlay) onPlay();
        });

        player.on('pause', () => {
          console.log('Video paused');
          
          // Show the big play button when video is paused
          const bigPlayButton = player.el().querySelector('.vjs-big-play-button');
          if (bigPlayButton) {
            bigPlayButton.style.display = 'block';
          }
          
          if (onPause) onPause();
        });

        player.on('ended', () => {
          console.log('Video ended');
          if (onEnded) onEnded();
        });

        player.on('timeupdate', () => {
          if (onTimeUpdate) onTimeUpdate(player.currentTime());
        });

        player.on('volumechange', () => {
          if (onVolumeChange) onVolumeChange(player.volume());
        });

        player.on('error', (error) => {
          console.error('Video.js error:', error);
          
          // Get more specific error information
          const playerError = player.error();
          let errorMessage = 'Video playback error';
          
          if (playerError) {
            switch (playerError.code) {
              case 1:
                errorMessage = 'Video loading aborted';
                break;
              case 2:
                errorMessage = 'Network error - check your connection';
                break;
              case 3:
                errorMessage = 'Video decoding failed - format not supported';
                break;
              case 4:
                errorMessage = 'Video source not supported or server error';
                break;
              default:
                errorMessage = `Video error (code: ${playerError.code})`;
            }
          }
          
          setError(errorMessage);
          console.log('Video source URL:', src);
          console.log('Video type:', getVideoType(src));
        });

        player.on('loadstart', () => {
          console.log('Video load started');
          setError(null);
        });

        player.on('loadeddata', () => {
          console.log('Video data loaded');
        });

        player.on('loadedmetadata', () => {
          console.log('Video metadata loaded');
        });

        player.on('canplay', () => {
          console.log('Video can start playing');
        });

        // Add click handler for big play button
        player.on('click', () => {
          console.log('Video player clicked');
          if (player.paused()) {
            player.play();
          } else {
            player.pause();
          }
        });

      } catch (err) {
        console.error('Error creating Video.js player:', err);
        setError('Failed to create video player');
      }
    }, 100);

    // Cleanup function
    return () => {
      if (playerRef.current) {
        console.log('Disposing Video.js player');
        try {
          playerRef.current.dispose();
        } catch (error) {
          console.error('Error disposing player:', error);
        }
        playerRef.current = null;
        setIsPlayerReady(false);
      }
    };
  }, [src, poster, autoPlay, muted, preload, onReady, onPlay, onPause, onEnded, onTimeUpdate, onVolumeChange]);

  console.log('VideoPlayer render - isPlayerReady:', isPlayerReady, 'error:', error);

  return (
    <div className="video-player-container">
      <div className="video-player-header">
        <h2 className="video-title">{title || 'Video Player'}</h2>
        <div className="video-stats">
          <span className="video-time">
            {error ? 'Error' : isPlayerReady ? 'Ready' : 'Loading...'}
          </span>
          <span className="video-quality">HD</span>
        </div>
      </div>
      
      <div className="video-player-wrapper">
        {/* Error state */}
        {error && (
          <div className="video-error">
            <p>Error: {error}</p>
            <p>Video source: {src}</p>
            <p>Video type: {getVideoType(src)}</p>
            <div className="video-error-actions">
              <button onClick={() => window.open(src, '_blank')}>
                Open Video in New Tab
              </button>
              <button onClick={() => setError(null)}>
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Video.js container */}
        <div className="video-js-container">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
            playsInline
            data-setup="{}"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 