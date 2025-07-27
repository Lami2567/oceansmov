import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <i className="fas fa-bars"></i>
      </button>
      <Link to="/" className="navbar-logo" onClick={handleLinkClick}>🎬 MovieWeb</Link>
      <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
      </button>
      <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        {user && user.is_admin && <Link to="/admin" onClick={handleLinkClick}>Admin</Link>}
        {!user && <Link to="/login" onClick={handleLinkClick}>Login</Link>}
        {!user && <Link to="/register" onClick={handleLinkClick}>Register</Link>}
        {user && <span className="navbar-user">Hello, {user.username}</span>}
        {user && <button className="navbar-logout" onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar; 