import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="card shadow-sm border-0 mx-auto p-4" style={{ maxWidth: '500px', background: '#faf8f3' }}>
          <div className="card-body">
            <h3 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Authentication Required</h3>
            <p className="text-muted mb-4">Please log in to access this page.</p>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn btn-dark px-4" 
                onClick={() => openAuthModal('login')}
              >
                Log In
              </button>
              <button 
                className="btn btn-outline-dark px-4" 
                onClick={() => openAuthModal('register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="card shadow-sm border-0 mx-auto p-4" style={{ maxWidth: '500px', background: '#faf8f3' }}>
          <div className="card-body">
            <span className="badge bg-danger mb-3 px-3 py-2">RESTRICTED ACCESS</span>
            <h3 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Access Denied</h3>
            <p className="text-muted mb-4">You do not have Administrator permissions to view this section.</p>
            <p className="small text-secondary mb-4">Logged in as: <strong>{user.email}</strong> (Role: {user.role})</p>
            <a href="/" className="btn btn-dark px-4">Return to Home</a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
