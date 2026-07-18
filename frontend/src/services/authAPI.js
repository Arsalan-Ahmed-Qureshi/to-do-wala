// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Auth API calls
export const authAPI = {
  signup: async (username, email, password, confirmPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword,
      }),
    });
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    return response.json();
  },
};

// Export existing API
export { default as todoAPI } from './api';
