import React, { useState } from 'react';
import './AddReviewForm.css';

const AddReviewForm = ({ onSubmit, loading }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ rating, comment });
    setComment('');
    setRating(5);
  };

  return (
    <form className="add-review-form" onSubmit={handleSubmit}>
      <label>
        Rating:
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label>
        Comment:
        <textarea value={comment} onChange={e => setComment(e.target.value)} required />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Add Review'}</button>
    </form>
  );
};

export default AddReviewForm; 