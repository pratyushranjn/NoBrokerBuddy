import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  return user ? children : <Navigate to="/login" state={{ message: 'Please log in to continue.' }} replace />;
};

export default PrivateRoute;

