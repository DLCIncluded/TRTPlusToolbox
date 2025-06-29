<template>
	<div class="min-h-screen bg-gray-900 flex items-center justify-center">
	  <div class="bg-gray-800 rounded-lg p-8 w-full max-w-md text-center">
		<h2 class="text-white text-xl mb-4">Authenticating...</h2>
		<div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
	  </div>
	</div>
  </template>
  
  <script>
import authService from '../services/auth.service';
import { mapStores } from 'pinia'
import { useUserStore } from '@/stores/user'
export default {
	computed: {
		...mapStores(useUserStore),

		displayName() {
		return this.userStore.discord?.global_name || this.userStore.discord?.username || 'Guest'
		},

		avatarUrl() {
		const { id, avatar } = this.userStore.discord || {}
		return id && avatar
			? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
			: 'https://via.placeholder.com/128?text=User'
		}
	},
	async created() {
		// Get code from URL
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		
		if (code) {
			const success = await authService.authenticate(code);

			if (success) {
				await authService.getUserRoles();

				this.$router.push('/');

			} else {
				this.$router.push('/login?error=auth_failed');
				this.$toast.error("You do not have access")
			}
		} else {
				this.$router.push('/login?error=no_code');
				this.$toast.error("Failed to get code")
		}
	}
}
</script>