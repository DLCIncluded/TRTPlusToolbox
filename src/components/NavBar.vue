<template>
	<div class="menu-overlay" :class="{'is-active': showNav}" @click="showNav = false"></div>
	<!-- Mobile burger button -->
	<div class="mobile-burger-container" :class="{'is-active': showNav}">
		<a class="navbar-burger" role="button" aria-label="menu" aria-expanded="false" :class="{'is-active': showNav}" @click="showNav = !showNav">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>
	
	<aside class="navbar pl-3 menu" :class="{'is-open': showNav}">
		<div class="menu-content">
			<p class="menu-label mt-5">{{ welcomeMessage }}</p>
			<ul class="menu-list">
				<li v-if="!isLoggedIn"><RouterLink to="/login" active-class="is-active">Login</RouterLink></li>
				<li v-if="!isLoggedIn"><RouterLink to="/register" active-class="is-active">Register</RouterLink></li>
				<li v-if="isLoggedIn"><RouterLink to="/profile" active-class="is-active">Profile</RouterLink></li>
				<li v-if="isLoggedIn"><RouterLink to="/settings" active-class="is-active">Settings</RouterLink></li>
				<li v-if="isLoggedIn"><RouterLink to="/logout" active-class="is-active">Logout</RouterLink></li>
			</ul>
			<p class="menu-label mt-5">General</p>
			<ul class="menu-list">
				<li><RouterLink to="/" active-class="is-active">Home</RouterLink></li>
				<li v-if="isLoggedIn"><RouterLink to="/dashboard" active-class="is-active">Dashboard</RouterLink></li>
			</ul>
			<p class="menu-label" v-if="isLoggedIn">Planner</p>
			<ul class="menu-list">
				<li v-if="isLoggedIn"><RouterLink to="/inventory" active-class="is-active">Inventory</RouterLink></li>
				<li v-if="isLoggedIn"><RouterLink to="/cycleplanner" active-class="is-active">Cycle Planner</RouterLink></li>
				<li v-if="isLoggedIn"><RouterLink to="/cyclecalendar" active-class="is-active">Cycle Calendar</RouterLink></li>
			</ul>
			<p class="menu-label" v-if="isLoggedIn">Tools</p>
			<ul class="menu-list" v-if="isLoggedIn">
				<li><RouterLink to="/dosagecalc" active-class="is-active">Dosage Calculator</RouterLink></li>
				<li><RouterLink to="/vialcalc" active-class="is-active">Weekly Vial Calculator</RouterLink></li>
			</ul>
			<p class="menu-label">Info</p>
			<ul class="menu-list">
				<li><RouterLink to="/about" active-class="is-active">About</RouterLink></li>
			</ul>
		</div>
	</aside>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { mapStores } from 'pinia';

export default {
	name: 'NavBar',
	data() {
		return {
			sections: {
				elements: false,
				components: true,
				form: false,
				layout: false,
			},
			showNav: false
		}
	},
	methods: {
		toggleSection(section) {
			this.sections[section] = !this.sections[section]
		},
	},
	watch: {
		$route() {
			this.showNav = false;
		},
	},
	computed: {
		...mapStores(useAuthStore),
		isLoggedIn() {
			return this.authStore.isAuthenticated;
		},
		welcomeMessage() {
			return this.authStore.welcomeMessage;
		}
	},
}
</script>

<style scoped>
.menu {
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    overflow-y: auto;
    transition: transform 0.3s ease;
	padding-top:1rem
}

/* Burger button container - always visible */
.mobile-burger-container {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 35;
	transition: transform 0.4s ease;
}

/* Override Bulma's navbar-burger hiding on desktop */
.navbar-burger {
    display: block !important;
}

/* .desktop-burger {
    display: none;
} */

/* Menu overlay - always functional */
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 25;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.menu-overlay.is-active {
    opacity: 1;
    visibility: visible;
}

/* Burger menu animation - always active */
.mobile-burger-container.is-active {
	transform: translateX(400%);
}

/* Menu always starts hidden and slides in when opened */
.menu {
    transform: translateX(-100%);
    z-index: 30;
}

.menu.is-open {
    transform: translateX(0);
}


</style>