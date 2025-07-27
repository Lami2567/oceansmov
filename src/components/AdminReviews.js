import React, { useEffect, useState } from 'react';
import { fetchMovies, fetchReviews, approveReview, deleteReview } from '../services/api';
import './AdminReviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch all movies, then fetch reviews for each
        const moviesRes = await fetchMovies();
        const allReviews = [];
        for (const movie of moviesRes.data) {
          const reviewsRes = await fetchReviews(movie.id);
          for (const review of reviewsRes.data) {
            if (!review.approved) {
              allReviews.push({ ...review, movieTitle: movie.title });
            }
          }
        }
        setReviews(allReviews);
      } catch (err) {
        setError('Failed to load reviews');
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      setReviews(reviews.filter(r => r.id !== id));
    } catch {
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="admin-reviews">
      <h2>Moderate Reviews</h2>
      {loading ? <p>Loading...</p> : (
        <table className="admin-review-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.movieTitle}</td>
                <td>{review.username}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{new Date(review.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="approve-btn" onClick={() => handleApprove(review.id)}>Approve</button>
                  <button className="delete-btn" onClick={() => handleDelete(review.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
};

export default AdminReviews; 