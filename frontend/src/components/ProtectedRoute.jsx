import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles is OPTIONAL — jab nahi diya jaata (existing admin usage),
// behavior bilkul same rehta hai jaisa pehle tha (bas login check).
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const userRole = (user.role || '').toLowerCase();

  if (allowedRoles) {
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
    if (!normalizedAllowed.includes(userRole)) {
      const redirectMap = {
        admin: '/',
        client: '/client',
        associate: '/associate',
        accounts: '/accounts',
      };
      return <Navigate to={redirectMap[userRole] || '/login'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
