import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. While checking if user is logged in, show a loading text
  if (loading) return <div>Loading...</div>;

  // 2. If no user is found, kick them to the Login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If user is logged in, let them see the page
  return children;
};

export default ProtectedRoute;