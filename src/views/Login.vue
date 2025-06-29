<template>
	<div>
		<h1 class="title has-text-centered">TRT+ Toolbox</h1>
	</div>
	<article class="panel is-primary">
		<p class="panel-heading">Primary</p>
		<div class="panel-block">
			<button @click="loginWithDiscord" class="button is-primary">
				Login with Discord
			</button>
		</div>
	</article>

</template>

<script>
import authService from '../services/auth.service';

export default {
    name: 'HomeView',
    components: {
    },
    data() {
            return {
               
            }
    },
    methods: {
		 loginWithDiscord() {
			window.location.href = authService.getAuthUrl();
		}
    }
}
</script>