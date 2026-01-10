import api from './client';

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.password - Password
   * @param {string} [userData.email] - Email (optional)
   */
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   */
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   */
  async changePassword(passwordData) {
    const response = await api.post('/api/auth/change-password', passwordData);
    return response.data;
  }
};

export const cycleAPI = {
  /**
   * Get all cycles for current user
   */
  async getCycles() {
    const response = await api.get('/api/cycles');
    return response.data;
  },

  /**
   * Create a new cycle
   * @param {Object} cycleData - Cycle data
   * @param {string} [cycleData.title] - Cycle title
   * @param {Object} cycleData.data - Cycle data object
   */
  async createCycle(cycleData) {
    const response = await api.post('/api/cycles', cycleData);
    return response.data;
  },

  /**
   * Get a specific cycle by ID
   * @param {number} cycleId - Cycle ID
   */
  async getCycle(cycleId) {
    const response = await api.get(`/api/cycles/${cycleId}`);
    return response.data;
  },

  /**
   * Update a specific cycle
   * @param {number} cycleId - Cycle ID
   * @param {Object} cycleData - Updated cycle data
   */
  async updateCycle(cycleId, cycleData) {
    const response = await api.put(`/api/cycles/${cycleId}`, cycleData);
    return response.data;
  },

  /**
   * Delete a specific cycle
   * @param {number} cycleId - Cycle ID
   */
  async deleteCycle(cycleId) {
    const response = await api.delete(`/api/cycles/${cycleId}`);
    return response.data;
  },

  /**
   * Duplicate a cycle
   * @param {number} cycleId - Cycle ID to duplicate
   * @param {string} [title] - New cycle title
   */
  async duplicateCycle(cycleId, title) {
    const payload = title ? { title } : {};
    const response = await api.post(`/api/cycles/${cycleId}/duplicate`, payload);
    return response.data;
  }
};