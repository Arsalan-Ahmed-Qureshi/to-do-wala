import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://cc2f-39-34-143-186.ngrok-free.app/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token and user ID
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        config.headers['X-User-Id'] = user.id;
      }
    } catch (error) {
      console.error('Error reading user from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - token expired or invalid
      AsyncStorage.removeItem('user');
      AsyncStorage.removeItem('token');
      // Dispatch logout action to Redux
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Auth API
export const authAPI = {
  signup: (credentials) => 
    axiosInstance.post('/auth/signup', credentials),
  login: (credentials) => 
    axiosInstance.post('/auth/login', credentials),
};

// Todo API
export const todoAPI = {
  getAllTodos: () => 
    axiosInstance.get('/todos'),
  getActiveTodos: () => 
    axiosInstance.get('/todos/active'),
  getCompletedTodos: () => 
    axiosInstance.get('/todos/completed'),
  getTodoById: (id) => 
    axiosInstance.get(`/todos/${id}`),
  createTodo: (todoData) => 
    axiosInstance.post('/todos', todoData),
  updateTodo: (id, todoData) => 
    axiosInstance.put(`/todos/${id}`, todoData),
  deleteTodo: (id) => 
    axiosInstance.delete(`/todos/${id}`),
  deleteAllTodos: () => 
    axiosInstance.delete('/todos'),
};

// Sync API (NEW - for mobile offline sync)
export const syncAPI = {
  pushChanges: (changes) => 
    axiosInstance.post('/sync/push', { changes }),
  pullChanges: (lastSyncTime) => 
    axiosInstance.post('/sync/pull', { lastSyncTime }),
};
