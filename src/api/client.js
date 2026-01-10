import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout and redirect to login
      const authStore = useAuthStore();
      authStore.logout();
      
      // Redirect to login if not already there
      if (router.currentRoute.value.name !== 'login') {
        router.push('/login');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;