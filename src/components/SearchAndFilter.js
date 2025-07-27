import React, { useState, useEffect } from 'react';
import { fetchGenres, fetchYears } from '../services/api';
import './SearchAndFilter.css';

const SearchAndFilter = ({ onSearch, onFilter, onSort, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      const [genresRes, yearsRes] = await Promise.all([
        fetchGenres(),
        fetchYears()
      ]);
      setGenres(genresRes.data);
      setYears(yearsRes.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleFilter = () => {
    const filters = {};
    if (selectedGenre !== 'all') filters.genre = selectedGenre;
    if (selectedYear !== 'all') filters.year = selectedYear;
    if (sortBy !== 'created_at') filters.sortBy = sortBy;
    if (sortOrder !== 'DESC') filters.sortOrder = sortOrder;
    
    onFilter(filters);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    onSort(field, order);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedYear('all');
    setSortBy('created_at');
    setSortOrder('DESC');
    onClear();
  };

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search movies by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Filter Toggle */}
      <div className="filter-toggle">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="filter-toggle-button"
        >
          {isExpanded ? '▼' : '▶'} Filters & Sort
        </button>
        {(selectedGenre !== 'all' || selectedYear !== 'all' || sortBy !== 'created_at') && (
          <span className="active-filters-indicator">●</span>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="filters-section">
          <div className="filters-grid">
            {/* Genre Filter */}
            <div className="filter-group">
              <label className="filter-label">Genre:</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="all">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="filter-group">
              <label className="filter-label">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <div className="sort-buttons">
                <button
                  onClick={() => handleSort('title', 'ASC')}
                  className={`sort-button ${sortBy === 'title' && sortOrder === 'ASC' ? 'active' : ''}`}
                >
                  Title A-Z
                </button>
                <button
                  onClick={() => handleSort('title', 'DESC')}
                  className={`sort-button ${sortBy === 'title' && sortOrder === 'DESC' ? 'active' : ''}`}
                >
                  Title Z-A
                </button>
                <button
                  onClick={() => handleSort('release_year', 'DESC')}
                  className={`sort-button ${sortBy === 'release_year' && sortOrder === 'DESC' ? 'active' : ''}`}
                >
                  Newest
                </button>
                <button
                  onClick={() => handleSort('release_year', 'ASC')}
                  className={`sort-button ${sortBy === 'release_year' && sortOrder === 'ASC' ? 'active' : ''}`}
                >
                  Oldest
                </button>
                <button
                  onClick={() => handleSort('created_at', 'DESC')}
                  className={`sort-button ${sortBy === 'created_at' && sortOrder === 'DESC' ? 'active' : ''}`}
                >
                  Recently Added
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button onClick={handleFilter} className="apply-filters-button">
              Apply Filters
            </button>
            <button onClick={handleClear} className="clear-filters-button">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter; 