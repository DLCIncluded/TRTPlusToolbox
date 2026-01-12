<template>
	<section class="section">
		<div class="container has-text-centered">
			<div class="box">
				<!-- <figure class="image is-128x128 is-inline-block">
					<img
					class="is-rounded"
					:src="avatarUrl"
					alt="User avatar"
					/>
				</figure> -->
				<h1 class="title is-4 mt-4">Hello, {{ displayName }} 👋</h1>
				<p class="subtitle is-6 has-text-grey mt-4">
					Dashboard Coming Soon!
				</p>
				<ul>
					<!-- <li v-for="server in userStore.servers">{{ server.name }}</li> -->
						<!-- <li v-for="role in userStore.roles">{{ role.name }}</li> -->
				</ul>
			</div>
		</div>
	</section>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'UserDashboard',

  computed: {
    ...mapStores(useAuthStore),

    displayName() {
      return this.authStore.username || 'Guest'
    },

    // avatarUrl() {
    //   const { id, avatar } = this.userStore.discord || {}
    //   return id && avatar
    //     ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
    //     : 'https://via.placeholder.com/128?text=User'
    // }
  }
}
</script>
