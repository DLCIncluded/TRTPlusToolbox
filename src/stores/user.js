// DEPRECATED: This store has been replaced with the auth store
// Use @/stores/auth instead
// This file is kept temporarily for migration purposes and should be removed

import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
	state: () => ({
		// Deprecated properties - redirect to auth store
		username: null,
		isLoggedIn: false,
		roles: null,
		discord: null,
		servers: null
	}),
	getters: {
		welcomeMessage: () => {
			const authStore = useAuthStore()
			return authStore.welcomeMessage
		}
	},
	actions: {
		// Compatibility methods for migration
		setUser(user) {
			console.warn('useUserStore.setUser is deprecated. Use useAuthStore instead.')
			// This method is kept for compatibility during migration
		},
		setRoles(roles) {
			console.warn('useUserStore.setRoles is deprecated. Role-based auth has been removed.')
		},
		logout(error = false) {
			console.warn('useUserStore.logout is deprecated. Use useAuthStore.logout instead.')
			const authStore = useAuthStore()
			authStore.logout()
		},
		setupFromStorage() {
			console.warn('useUserStore.setupFromStorage is deprecated. Use useAuthStore.init instead.')
			const authStore = useAuthStore()
			authStore.init()
		}
	}
})
