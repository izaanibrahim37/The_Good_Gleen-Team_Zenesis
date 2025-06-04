import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from '../contexts/UserRoleContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading: authLoading } = useAuth();
  const { role: userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to appropriate auth page if not authenticated
    if (!authLoading && !user) {
      switch (role) {
        case 'farmer':
          navigate('/farmer-auth');
          break;
        case 'retailer':
          navigate('/retailer-auth');
          break;
        case 'ngo':
          navigate('/ngo-auth');
          break;
        default:
          navigate('/');
      }
    }
  }, [authLoading, user, role, navigate]);

  // Show loading indicator while authentication state is being determined
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated, redirect is handled in useEffect
  if (!user) {
    return null;
  }

  // User doesn't have the required role
  if (userRole !== role) {
    // Redirect to appropriate dashboard based on actual role
    let redirectPath = '/';
    if (userRole === 'farmer') redirectPath = '/farmer-dashboard';
    else if (userRole === 'retailer') redirectPath = '/retailer-dashboard';
    else if (userRole === 'ngo') redirectPath = '/ngo-dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;