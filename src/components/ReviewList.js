import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews }) => (
  <div className="review-list">
    <h3>Reviews</h3>
    {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(review => (
      <div className="review" key={review.id}>
        <div className="review-header">
          <span className="review-user">{review.username}</span>
          <span className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
          <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
        </div>
        <div className="review-comment">{review.comment}</div>
      </div>
    ))}
  </div>
);

export default ReviewList; 