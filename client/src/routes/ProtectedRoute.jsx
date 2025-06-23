import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );

  return user ? children : <Navigate to="/login" state={{ message: 'Please log in to continue.' }} replace />;
};

export default PrivateRoute;

