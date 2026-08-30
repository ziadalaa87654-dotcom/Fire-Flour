import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, setAuthModalMode, login, register } = useAuth();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        showToast('Successfully logged in!', 'success');
      } else {
        await register(name, email, password, role);
        showToast(`Account created as ${role.toUpperCase()}!`, 'success');
      }
      
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      showToast('Successfully logged in!', 'success');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1055 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px', background: '#faf8f3' }}>
          
          {}
          <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h4 className="modal-title font-serif fw-bold" style={{ color: '#171714' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h4>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={closeAuthModal} 
            />
          </div>

          {}
          <div className="px-4 pt-3">
            <div className="btn-group w-100 p-1" style={{ background: '#e8e3d7', borderRadius: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${isLogin ? 'btn-light fw-bold shadow-sm' : 'btn-link text-decoration-none text-muted'}`}
                style={{ borderRadius: '6px' }}
                onClick={() => { setAuthModalMode('login'); setError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`btn btn-sm ${!isLogin ? 'btn-light fw-bold shadow-sm' : 'btn-link text-decoration-none text-muted'}`}
                style={{ borderRadius: '6px' }}
                onClick={() => { setAuthModalMode('register'); setError(''); }}
              >
                Register
              </button>
            </div>
          </div>

          {}
          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small border-0" style={{ borderRadius: '6px' }}>
                {error}
              </div>
            )}

            {isLogin && (
              <div className="mb-3 p-2 bg-light rounded text-center small">
                <span className="d-block text-muted mb-1">Quick Demo Credentials:</span>
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    type="button" 
                    className="btn btn-xs btn-outline-danger py-1 px-2 fw-semibold"
                    style={{ fontSize: '12px' }} 
                    onClick={() => handleQuickLogin('admin@freshmart.com', 'password123')}
                  >
                    👑 Admin Demo
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-xs btn-outline-secondary py-1 px-2 fw-semibold" 
                    style={{ fontSize: '12px' }}
                    onClick={() => handleQuickLogin('ziad@gmail.com', 'password123')}
                  >
                    👤 User Demo
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-1"
                    placeholder="e.g. Ziad Alaa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg border-1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg border-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Account Type / Role</label>
                  <select
                    className="form-select form-select-lg"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">Customer / User</option>
                    <option value="admin">Administrator (Admin Panel Access)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-danger btn-lg w-100 mt-2 fw-bold"
                style={{ backgroundColor: '#b72d20', borderColor: '#b72d20', borderRadius: '8px' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          {}
          <div className="modal-footer border-top-0 pt-0 pb-4 px-4 justify-content-center">
            <p className="small text-muted mb-0">
              {isLogin ? (
                <>Don't have an account? <a href="#register" className="text-danger fw-semibold text-decoration-none" onClick={(e) => { e.preventDefault(); setAuthModalMode('register'); }}>Sign up here</a></>
              ) : (
                <>Already have an account? <a href="#login" className="text-danger fw-semibold text-decoration-none" onClick={(e) => { e.preventDefault(); setAuthModalMode('login'); }}>Sign in here</a></>
              )}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
