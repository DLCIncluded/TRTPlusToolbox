import { defineStore } from 'pinia'
import { useToast } from 'vue-toast-notification'

export const useUserStore = defineStore('user', {
	state: () => ({
		username: null,
		isLoggedIn: false,
		roles: null,
		discord: null,
		servers: null
	}),
	getters: {
		welcomeMessage: (state) => `Welcome ${state.username || 'Guest'}`
	},
	actions: {
		setUser(user) {
			this.username = user.username || user.name || 'Guest';
			this.isLoggedIn = true;
			console.log(user)
			this.discord = JSON.parse(localStorage.getItem('discord_user_data'))
			this.servers = JSON.parse(localStorage.getItem('discord_server_data')) || [];
		},
		setRoles(roles) {
			this.roles = roles;
		},
		logout(error = false) {
			if (error) {
				const toast = useToast();
				toast.error("You're not a member of Chase Iron's Discord server. Please join to access this feature.");
			}
			this.username = null;
			this.isLoggedIn = false;
			this.roles = null;
		},
		setupFromStorage() {
			const userData = localStorage.getItem('discord_user_data');
			const roleData = localStorage.getItem('discord_role_data');
			if (userData && roleData) {
				const user = JSON.parse(userData);
				const roles = JSON.parse(roleData);
				this.setUser(user);
				this.setRoles(roles);
			} else {
				this.logout();
			}
		}
	},


})
