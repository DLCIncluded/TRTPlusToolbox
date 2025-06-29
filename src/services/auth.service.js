import axios from 'axios';
import Cookies from 'js-cookie';
import discordConfig from '../discord.config';

const AUTH_TOKEN = 'discord_auth_token';
const USER_DATA = 'discord_user_data';
const SERVER_DATA = 'discord_server_data';
const ROLE_DATA = 'discord_role_data';
const API_BASE_URL = import.meta.env.VITE_API_URL;

import { useUserStore } from '@/stores/user'

export default {
	// Get auth URL for Discord login
	getAuthUrl() {
		return discordConfig.AUTH_URL();
	},

	// Exchange code for token
	async authenticate(code) {
		try {
			// Send code to your Flask backend
			const response = await axios.post(`${API_BASE_URL}/api/auth/discord`, { code });
			
			const { access_token, expires_in } = response.data;
			const expiresAt = new Date(new Date().getTime() + expires_in * 1000);
			
			// Store the token in a cookie
			Cookies.set(AUTH_TOKEN, access_token, { expires: expiresAt });
			
			// Fetch user data
			await this.fetchUserData();
			
			return true;
		} catch (error) {
			console.error('Authentication error:', error);
			return false;
		}
	},

	// Exchange userid for roles
	async getUserRoles() {
		try {
			const response = await axios.post(`${API_BASE_URL}/api/user/roles`, {
				server_id: '1072358864873340978'
				}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.getToken()}`
				}
			});
			console.log(response.data)	

			const roles = response.data;
			
			const userStore = useUserStore()

			// Minimum number of roles required for a valid user (adjust as needed)
			const MINIMUM_ROLE_COUNT = 2;

			if (
				!Array.isArray(roles) ||
				roles.length < MINIMUM_ROLE_COUNT || // Ensure user has at least the minimum number of roles
				!roles.some(role => role.name && role.name.toLowerCase().includes('youtube member'))
			) {
				this.logout();
				userStore.logout(true);
				console.error('Invalid roles data:', roles);
				return false;
			} 

			localStorage.setItem(ROLE_DATA, JSON.stringify(roles));

			userStore.setRoles(response.data);

		} catch (error) {
			console.error('Authentication error:', error);
			return false;
		}
	},

	// Fetch user data from Discord API
	async fetchUserData() {
		const token = this.getToken();
		if (!token) return null;

		try {
		// Fetch user profile directly from Discord API
		const userResponse = await axios.get(`${discordConfig.API_ENDPOINT}/users/@me`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		
		// Fetch user's servers
		const guildsResponse = await axios.get(`${discordConfig.API_ENDPOINT}/users/@me/guilds`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		
		// Store in local storage
		localStorage.setItem(USER_DATA, JSON.stringify(userResponse.data));
		localStorage.setItem(SERVER_DATA, JSON.stringify(guildsResponse.data));

		const userStore = useUserStore()
		userStore.setUser(userResponse.data);
		// userStore.setGuilds(guildsResponse.data);

		return {
			user: userResponse.data,
			guilds: guildsResponse.data
		};
		} catch (error) {
			console.error('Error fetching user data:', error);
			if (error.response && error.response.status === 401) {
				this.logout(); // Token expired
			}
			return null;
		}
	},


	getUserData() {
		const userData = localStorage.getItem(USER_DATA);
		return userData ? JSON.parse(userData) : null;
	},

	getServerData() {
		const serverData = localStorage.getItem(SERVER_DATA);
		return serverData ? JSON.parse(serverData) : null;
	},

	getToken() {
		return Cookies.get(AUTH_TOKEN);
	},

	isAuthenticated() {
		return !!this.getToken();
	},

	logout() {
		Cookies.remove(AUTH_TOKEN);
		localStorage.removeItem(USER_DATA);
		localStorage.removeItem(SERVER_DATA);
		localStorage.removeItem(ROLE_DATA);
		const userStore = useUserStore()
		userStore.logout();
	}
};