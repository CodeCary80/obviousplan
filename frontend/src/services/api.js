import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),

  
};

// Evening Plan API functions
export const planAPI = {
  generatePlan: (data) => api.post('/evening-plans', data),
  getSchedule: (hash) => api.get(`/evening-plans/${hash}`),
  shuffleRestaurant: (hash) => api.post(`/evening-plans/${hash}/shuffle-restaurant`),
  shuffleActivity: (hash) => api.post(`/evening-plans/${hash}/shuffle-activity`),
  confirmSchedule: (hash) => api.post(`/evening-plans/${hash}/confirm`),

  sendPasswordResetEmail: (email) => api.post('/password/email', { email }),
  resetPassword: (data) => api.post('/password/reset', data),
  validateResetToken: (email, token) => api.post('/password/validate-token', { email, token }),
  
};

// User API functions
export const userAPI = {
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (scheduleId) => api.post('/user/favorites', { schedule_id: scheduleId }),
  removeFromFavorites: (scheduleId) => api.delete(`/user/favorites/${scheduleId}`),
  getHistory: () => api.get('/user/history'),
  rateSchedule: (scheduleId, data) => api.post(`/user/history/${scheduleId}/rate`, data),
};

// Admin API functions
export const adminAPI = {
  // Restaurants
  getRestaurants: (params) => api.get('/admin/restaurants', { params }),
  createRestaurant: (data) => api.post('/admin/restaurants', data),
  updateRestaurant: (id, data) => api.put(`/admin/restaurants/${id}`, data),
  deleteRestaurant: (id) => api.delete(`/admin/restaurants/${id}`),
  
  // Activities
  getActivities: (params) => api.get('/admin/activities', { params }),
  createActivity: (data) => api.post('/admin/activities', data),
  updateActivity: (id, data) => api.put(`/admin/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/admin/activities/${id}`),
  
  // Tips
  getTips: (params) => api.get('/admin/tips', { params }),
  createTip: (data) => api.post('/admin/tips', data),
  updateTip: (id, data) => api.put(`/admin/tips/${id}`, data),
  deleteTip: (id) => api.delete(`/admin/tips/${id}`),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};