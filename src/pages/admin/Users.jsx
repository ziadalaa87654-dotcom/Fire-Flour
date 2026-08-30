import React, { useEffect, useState, useMemo } from 'react';
import userService from '../../services/userService';
import UserModal from './UserModal';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function Users() {
  const { showToast } = useApp();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      showToast('Failed to load user list', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text = `${u.name} ${u.email} ${u.role}`.toLowerCase();
      return !searchQuery || text.includes(searchQuery.toLowerCase().trim());
    });
  }, [users, searchQuery]);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id || user.email === currentUser?.email) {
      showToast('You cannot delete your own logged-in account!', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to delete account "${user.email}"?`)) {
      try {
        await userService.deleteUser(user.id);
        showToast(`User ${user.email} deleted`, 'success');
        fetchUsers();
      } catch (err) {
        showToast('Failed to delete user', 'danger');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold font-serif mb-1" style={{ color: '#171714' }}>User Management</h2>
          <p className="text-muted small mb-0">Manage customer accounts, assign administrator privileges, or clean up accounts</p>
        </div>
        <button className="btn btn-dark px-4 fw-bold shadow-sm" onClick={handleCreate}>
          + Create User
        </button>
      </div>

      {}
      <div className="card border-0 shadow-sm p-3 mb-4" style={{ background: '#fff', borderRadius: '12px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {}
      <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No users found matching your search query.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>User Profile</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '38px', height: '38px', fontSize: '14px' }}
                        >
                          {(u.name || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{u.name || 'Registered Customer'}</div>
                          {u.id === currentUser?.id && (
                            <span className="badge bg-info text-dark" style={{ fontSize: '10px' }}>You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-muted small">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`} style={{ fontSize: '11px' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => handleEditRole(u)}
                      >
                        Edit Role
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u)}
                        disabled={u.id === currentUser?.id || u.email === currentUser?.email}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchUsers}
      />
    </div>
  );
}
