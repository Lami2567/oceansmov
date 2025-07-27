import React, { useState } from 'react';
import AdminMovies from '../components/AdminMovies';
import AdminReviews from '../components/AdminReviews';
import './Admin.css';

const Admin = () => {
  const [tab, setTab] = useState('movies');
  return (
    <div className="admin-container">
      <div className="admin-tabs">
        <button className={tab === 'movies' ? 'active' : ''} onClick={() => setTab('movies')}>Movies</button>
        <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>Reviews</button>
      </div>
      <div className="admin-content">
        {tab === 'movies' ? <AdminMovies /> : <AdminReviews />}
      </div>
    </div>
  );
};

export default Admin; 