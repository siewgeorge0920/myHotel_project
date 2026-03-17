import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userStr = localStorage.getItem('user');
  const timestamp = localStorage.getItem('loginTimestamp');

  if (!userStr || !timestamp) {
    return <Navigate to="/login?expired=1" replace />;
  }

  // Check 24 hour expiry
  const now = Date.now();
  const age = now - parseInt(timestamp);
  const isExpired = age > 24 * 60 * 60 * 1000;

  if (isExpired) {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    localStorage.removeItem('managerMode');
    return <Navigate to="/login?expired=1" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (!user || !user.role) {
      return <Navigate to="/login?expired=1" replace />;
    }
  } catch (e) {
    return <Navigate to="/login?expired=1" replace />;
  }

  return children;
}
