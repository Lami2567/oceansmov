import React, { useEffect, useState, useCallback } from 'react';
import { fetchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchAndFilter from '../components/SearchAndFilter';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const loadMovies = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters };
      const res = await fetchMovies(params);
      console.log('Loaded movies:', res.data);
      setMovies(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error loading movies:', err);
      setMovies([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMovies();
    // Refresh movies every 30 seconds to show new uploads
    const interval = setInterval(() => loadMovies(currentFilters), 30000);
    return () => clearInterval(interval);
  }, [loadMovies, currentFilters]);

  const handleSearch = (searchTerm) => {
    const filters = { ...currentFilters, search: searchTerm };
    setCurrentFilters(filters);
    loadMovies(filters);
  };

  const handleFilter = (filters) => {
    const newFilters = { ...currentFilters, ...filters };
    setCurrentFilters(newFilters);
    loadMovies(newFilters);
  };

  const handleSort = (sortBy, sortOrder) => {
    const filters = { ...currentFilters, sortBy, sortOrder };
    setCurrentFilters(filters);
    loadMovies(filters);
  };

  const handleClear = () => {
    setCurrentFilters({});
    loadMovies({});
  };

  const handleRefresh = () => {
    loadMovies(currentFilters);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Movie Collection</h1>
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
      
      {/* Search and Filter Component */}
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onClear={handleClear}
      />
      
      {loading ? (
        <div className="loading-container">
          <p>Loading movies...</p>
        </div>
      ) : (
        <div className="movie-list">
          {movies.length === 0 ? (
            <div className="no-movies">
              <p>No movies found.</p>
              <p>Try adjusting your search or filters!</p>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>Found {movies.length} movie{movies.length !== 1 ? 's' : ''}</p>
              </div>
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 