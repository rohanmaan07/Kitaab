import axios from 'axios';

// Determine the API base URL
// Priority: 1. Environment variable, 2. Production URL, 3. Localhost (dev fallback)
const getBaseURL = () => {
  // If VITE_API_URL is set in .env, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (built app), use the Render URL
  if (import.meta.env.PROD) {
    return 'https://kitaab-ezg8hhawdpebasfv.centralindia-01.azurewebsites.net';
  }

  // In development, use the Azure URL
  return 'https://kitaab-ezg8hhawdpebasfv.centralindia-01.azurewebsites.net';
};

// Create axios instance
const api = axios.create({
  baseURL: getBaseURL() + '/api/v1',
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
