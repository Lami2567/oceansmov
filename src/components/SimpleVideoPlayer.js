import React from 'react';
import './SimpleVideoPlayer.css';

const SimpleVideoPlayer = ({ src, title, poster }) => {
  if (!src) {
    return (
      <div className="simple-video-player">
        <div className="no-video">
          <h3>No Video Available</h3>
          <p>No video file has been uploaded for this movie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-video-player">
      <h3>{title}</h3>
      <video
        controls
        poster={poster}
        style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
      <div className="video-info">
        <p><strong>Video URL:</strong> {src}</p>
        <p><strong>Poster:</strong> {poster || 'None'}</p>
      </div>
    </div>
  );
};

export default SimpleVideoPlayer; 