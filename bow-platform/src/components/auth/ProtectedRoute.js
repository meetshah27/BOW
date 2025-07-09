import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = 'member' }) => {
  const { userData, loading, hasRole } = useAuth();

  // Debug logs for troubleshooting
  console.log('[ProtectedRoute] userData:', userData);
  console.log('[ProtectedRoute] requiredRole:', requiredRole);
  console.log('[ProtectedRoute] hasRole(requiredRole):', hasRole(requiredRole));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userData) {
    console.log('[ProtectedRoute] No userData, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(requiredRole)) {
    console.log('[ProtectedRoute] Access denied for role:', requiredRole, 'userData:', userData);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 