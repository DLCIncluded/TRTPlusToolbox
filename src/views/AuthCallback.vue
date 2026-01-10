<template>
  <div class="container">
    <div class="notification is-warning">
      <h2 class="title">Page Not Found</h2>
      <p>This authentication callback is no longer used. Please use the new login system.</p>
      <router-link to="/login" class="button is-primary">Go to Login</router-link>
    </div>
  </div>
</template>

<script>
// DEPRECATED: Discord auth callback - no longer used
export default {
  name: 'AuthCallback',

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