import { defineStore } from 'pinia';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    welcomeMessage: (state) => `Welcome ${state.user?.username || 'Guest'}`,
    userId: (state) => state.user?.id || null,
    username: (state) => state.user?.username || null,
  },

  actions: {
    /**
     * Initialize auth store from localStorage
     */
    init() {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');

      if (token && user) {
        try {
          this.accessToken = token;
          this.user = JSON.parse(user);
          this.isAuthenticated = true;
          
          // Verify token is still valid by fetching current user
          this.verifyAuth().catch(() => {
            this.logout();
          });
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          this.logout();
        }
      }
    },

    /**
     * Login with username and password
     */
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/auth/login', credentials);

        // Check for error status codes that might not trigger catch block
        if (response.status !== 200) {
          console.log("FUCK");
          console.log('Login failed with status:', response.status);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if(response.data.error){
          throw new Error(response.data.error);
        }

        // Validate required response fields before setting auth state
        if (!response.data.access_token || !response.data.user) {
          throw new Error('Invalid server response - missing authentication data');
        }

        this.accessToken = response.data.access_token;
        this.user = response.data.user;
        this.isAuthenticated = true;

        // Persist to localStorage
        localStorage.setItem('auth_token', this.accessToken);
        localStorage.setItem('auth_user', JSON.stringify(this.user));

        return { success: true };
      } catch (error) {
        // Ensure auth state is cleared on any error
        this.accessToken = null;
        this.user = null;
        this.isAuthenticated = false;
        
        // Handle different types of errors
        if (error.response?.status === 429) {
          this.error = 'Too many requests. Please try again later.';
        } else if (error.message?.includes('HTTP 429')) {
          this.error = 'Too many requests. Please try again later.';
        } else {
          this.error = error.response?.data?.error || error.error|| error.message || 'Login failed';
        }
        
        // const toast = useToast();
        // toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Register a new user
     */
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/auth/register', userData);

        const toast = useToast();
        toast.success('Registration successful! Please log in.');

        return { success: true, user: response.data.user };
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        // Notify server (if token is still valid)
        if (this.isAuthenticated) {
          await axios.post('/api/auth/logout').catch(() => {
            // Ignore logout errors - clear local state anyway
          });
        }
      } finally {
        // Clear local state
        this.user = null;
        this.accessToken = null;
        this.isAuthenticated = false;
        this.error = null;

        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },

    /**
     * Verify current auth status
     */
    async verifyAuth() {
      if (!this.accessToken) {
        return false;
      }

      try {
        const response = await axios.get('/api/auth/me');
        this.user = response.data.user;
        localStorage.setItem('auth_user', JSON.stringify(this.user));
        return true;
      } catch (error) {
        console.error('Auth verification failed:', error);
        return false;
      }
    },

    /**
     * Update user profile in store
     */
    updateUserProfile(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
        localStorage.setItem('auth_user', JSON.stringify(this.user));
      }
    },

    /**
     * Change password
     */
    async changePassword(passwordData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/auth/change-password', passwordData);

        const toast = useToast();
        toast.success(response.data?.message || 'Password changed successfully');

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to change password';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});