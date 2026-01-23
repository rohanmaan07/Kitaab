import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api/v1',
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    if (id) {
      config.headers.id = id;
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      console.error('Authentication error:', error.response?.data?.message);

      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
