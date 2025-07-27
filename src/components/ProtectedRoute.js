import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute; 