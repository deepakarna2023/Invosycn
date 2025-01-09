import React from 'react';
import { Navigate } from 'react-router-dom'; // Use Navigate instead of Redirect
import authService  from '../services/authentication/authService';

interface ProtectedRouteProps {
  element: React.ReactNode;
  path: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    // If not authenticated, redirect to the login page
    if (!authService.isAuthenticated()) {
      return <Navigate to="/" replace />;
    }
    // If authenticated, render the element (protected page)
    return <>{element}</>;
  };
  
  export default ProtectedRoute;