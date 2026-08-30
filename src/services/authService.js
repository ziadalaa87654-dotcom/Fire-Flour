import { apiRequest } from './apiClient';

const USERS_STORAGE_KEY = 'fire_flour_mock_users';
const CURRENT_USER_KEY = 'fire_flour_current_user';
const TOKEN_KEY = 'fire_flour_token';

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@freshmart.com',
    password: 'password123',
    role: 'admin',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'usr_admin',
    name: 'Admin Manager',
    email: 'admin@fireandflour.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 3,
    name: 'Ziad Alaa',
    email: 'ziad@gmail.com',
    password: 'password123',
    role: 'user',
    createdAt: '2026-02-15T14:30:00.000Z',
  },
  {
    id: 'usr_customer1',
    name: 'Marco Rossi',
    email: 'user@fireandflour.com',
    password: 'user123',
    role: 'user',
    createdAt: '2026-02-15T14:30:00.000Z',
  }
];

function getStoredUsers() {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  let list = [];
  if (data) {
    try {
      list = JSON.parse(data);
    } catch (e) {
      list = [];
    }
  }

  INITIAL_USERS.forEach((initUser) => {
    const existingIndex = list.findIndex((u) => u.email.toLowerCase() === initUser.email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], password: initUser.password };
    } else {
      list.push(initUser);
    }
  });

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
  return list;
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function formatUser(rawUser) {
  if (!rawUser) return null;
  const rawRole = String(rawUser.role || '').toLowerCase();
  const normalizedRole = rawRole === 'admin' ? 'admin' : 'user';
  const name = (rawUser.name === 'Emma Wilson' || rawUser.email === 'ziad@gmail.com' || rawUser.email === 'emma@example.com') ? 'Ziad Alaa' : rawUser.name;
  return {
    ...rawUser,
    name: name,
    role: normalizedRole,
  };
}

export const authService = {
  async login(email, password) {
    const cleanEmail = String(email || '').toLowerCase().trim();

    // 1. Try backend API login first
    try {
      const data = await apiRequest('/auth/login', 'POST', { email: cleanEmail, password });
      if (data.token && data.user) {
        const formatted = formatUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(formatted));
        return { user: formatted, token: data.token };
      }
    } catch (err) {
      // If network error OR backend failed for a demo user, attempt local check fallback
    }

    // 2. Local Storage / Fallback Check
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const mockToken = `mock_jwt_token_${user.id}_${Date.now()}`;
    const userObj = formatUser(user);

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
    return { user: userObj, token: mockToken };
  },

  async register(name, email, password, role = 'user') {
    try {
      
      const data = await apiRequest('/auth/register', 'POST', { name, email, password });
      if (data.token && data.user) {
        const formatted = formatUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(formatted));
        return { user: formatted, token: data.token };
      }
    } catch (err) {
      if (!err.isNetworkError && err.status >= 400) {
        throw new Error(err.message || 'Registration failed');
      }
    }

    const users = getStoredUsers();
    const cleanEmail = email.toLowerCase().trim();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    const mockToken = `mock_jwt_token_${newUser.id}_${Date.now()}`;
    const userObj = formatUser(newUser);

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
    return { user: userObj, token: mockToken };
  },

  async getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const data = await apiRequest('/auth/me', 'GET');
      if (data.user) {
        const formatted = formatUser(data.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      
    }

    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }

    return null;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};

export default authService;
