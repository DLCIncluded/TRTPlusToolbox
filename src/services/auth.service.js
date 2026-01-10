// DEPRECATED: This file has been replaced with the new auth system
// Use @/stores/auth and @/api instead
// This file is kept temporarily for migration purposes and should be removed

import { useAuthStore } from '@/stores/auth';

export default {
  // Compatibility methods for migration
  isAuthenticated() {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  },

  getUserData() {
    const authStore = useAuthStore();
    return authStore.user;
  },

  logout() {
    const authStore = useAuthStore();
    authStore.logout();
  }
};