import { apiRequest } from './apiClient';

const USERS_STORAGE_KEY = 'fire_flour_mock_users';

function formatUser(u) {
  if (!u) return null;
  const rawRole = String(u.role || '').toLowerCase();
  const normalizedRole = rawRole === 'admin' ? 'admin' : 'user';
  return {
    ...u,
    role: normalizedRole,
  };
}

function getStoredUsers() {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const userService = {
  async getUsers() {
    try {
      const data = await apiRequest('/users', 'GET');
      const list = data.users || (Array.isArray(data) ? data : []);
      if (Array.isArray(list)) {
        return list.map(formatUser);
      }
    } catch (err) {
      
    }
    return getStoredUsers().map(formatUser);
  },

  async updateUserRole(id, role) {
    const backendRole = String(role).toLowerCase() === 'admin' ? 'Admin' : 'Customer';
    try {
      const data = await apiRequest(`/users/${id}/role`, 'PATCH', { role: backendRole });
      if (data.user) return formatUser(data.user);
    } catch (err) {
      if (!err.isNetworkError && err.status >= 400) {
        throw new Error(err.message || 'Failed to update user role');
      }
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => String(u.id) === String(id));
    if (index === -1) throw new Error('User not found');

    users[index].role = role;
    saveStoredUsers(users);
    return formatUser(users[index]);
  },

  async deleteUser(id) {
    try {
      await apiRequest(`/users/${id}`, 'DELETE');
      return true;
    } catch (err) {
      if (!err.isNetworkError && err.status >= 400) {
        throw new Error(err.message || 'Failed to delete user account');
      }
    }

    const users = getStoredUsers();
    const filtered = users.filter((u) => String(u.id) !== String(id));
    saveStoredUsers(filtered);
    return true;
  },
};

export default userService;
