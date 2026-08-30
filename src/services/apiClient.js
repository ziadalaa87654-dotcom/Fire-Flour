
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  || 'http://localhost:4000/api';

export const getAuthToken = () => localStorage.getItem('fire_flour_token') || '';

export async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
  const token = getAuthToken();
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connErr = new Error('Backend server unreachable. Using local fallback.');
      connErr.isNetworkError = true;
      throw connErr;
    }
    throw err;
  }
}

export default {
  API_BASE_URL,
  apiRequest,
  getAuthToken,
};
