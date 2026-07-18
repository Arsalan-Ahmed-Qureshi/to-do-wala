import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Todo endpoints
export const todoAPI = {
  getAll: (userId) => api.get('/todos', { headers: { 'X-User-Id': userId } }),
  getActive: (userId) => api.get('/todos/active', { headers: { 'X-User-Id': userId } }),
  getCompleted: (userId) => api.get('/todos/completed', { headers: { 'X-User-Id': userId } }),
  getById: (id, userId) => api.get(`/todos/${id}`, { headers: { 'X-User-Id': userId } }),
  create: (data, userId) => api.post('/todos', data, { headers: { 'X-User-Id': userId } }),
  update: (id, data, userId) => api.put(`/todos/${id}`, data, { headers: { 'X-User-Id': userId } }),
  delete: (id, userId) => api.delete(`/todos/${id}`, { headers: { 'X-User-Id': userId } }),
  deleteAll: () => api.delete('/todos'),
};

export default api;
