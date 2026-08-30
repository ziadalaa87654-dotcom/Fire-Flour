import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { useApp } from '../../context/AppContext';

export default function UserModal({ user, isOpen, onClose, onSave }) {
  const { showToast } = useApp();
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setRole(user.role || 'user');
      setName(user.name || '');
      setEmail(user.email || '');
    } else {
      setRole('user');
      setName('');
      setEmail('');
      setPassword('password123');
    }
    setError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await userService.updateUserRole(user.id, role);
        showToast(`Updated role for ${user.email} to ${role.toUpperCase()}`, 'success');
      } else {
        await authService.register(name, email, password, role);
        showToast(`User ${email} created as ${role.toUpperCase()}`, 'success');
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message || 'Action failed');
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
          
          <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h4 className="modal-title font-serif fw-bold" style={{ color: '#171714' }}>
              {isEditing ? 'Manage User Permissions' : 'Create User Account'}
            </h4>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small border-0" style={{ borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isEditing ? (
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="fw-bold">{user.name || 'User'}</div>
                  <div className="small text-muted">{user.email}</div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Assigned Role / Authorization</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Standard User (Customer)</option>
                  <option value="admin">Administrator (Full Admin Access)</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger px-4 fw-bold" disabled={loading}>
                  {loading ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
