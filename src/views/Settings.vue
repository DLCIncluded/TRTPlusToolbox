<template>
	<section class="section" v-if="!showEditForm">
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

				<p class="subtitle is-6">Manage your user settings and preferences here.</p>
				<div class="content has-text-left">
					<h2 class="title is-5">Account Settings</h2>
					<ul>
						<li><strong>Username:</strong> {{ authStore.username || 'Not set' }}</li>
						<li><strong>Email:</strong> {{ authStore.user?.email || 'Not set' }}</li>
						<!-- Add more account settings as needed -->
					</ul>

					<h2 class="title is-5 mt-5">Preferences</h2>
					<ul>
						<li><strong>Preferred Home Page:</strong> {{ pageNames[homePage] || 'Home' }}</li>
						<!-- Add more preferences as needed -->
					</ul>
				</div>
				<div>
					<button class="button is-primary is-light mt-4" @click="showEditForm = true">Edit Settings</button>
				</div>
			</div>
		</div>
	</section>
	<section class="section" v-if="showEditForm">
		<div class="container">
			<div class="box">
				<h2 class="title is-4">Edit Settings</h2>

				<form @submit.prevent="saveSettings">
					<p>Username/Email cannot be changed at this time - please reach out to DLC if you need to for the time being.</p>
					<div class="field">
						<label class="label">Username</label>
						<div class="control">
							<input class="input" type="text" v-model="authStore.username" placeholder="Enter new username" disabled="true"/>
						</div>
					</div>

					<div class="field">
						<label class="label">Email</label>
						<div class="control">
							<input class="input" type="email" v-model="authStore.user.email" placeholder="Enter new email" disabled="true" />
						</div>
					</div>

					<div class="field">
						<label class="label">Preferred Home Page</label>
						<div class="control">
							<div class="select">
								<select v-model="homePage">
									<option value="home">Home</option>
									<option value="dashboard">Dashboard</option>
									<option value="inventory">Inventory</option>
									<option value="cycleplanner">Cycle Planner</option>
									<option value="cyclecalendar">Cycle Calendar</option>
								</select>
							</div>
						</div>
					</div>

					<div class="field is-grouped mt-4">
						<div class="control">
							<button class="button is-link" type="submit">Save Changes</button>
						</div>
						<div class="control">
							<button class="button is-light" type="reset">Cancel</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
	name: 'InventoryView',
	data() {
		return {
			authStore: useAuthStore(),
			homePage: null,
			pageNames: {
				home: 'Home',
				dashboard: 'Dashboard',
				inventory: 'Inventory',
				cycleplanner: 'Cycle Planner',
				cyclecalendar: 'Cycle Calendar',
			},
			showEditForm: false,
		}
	},
	computed: {
		// ...mapStores(useAuthStore),

		displayName() {
			return this.authStore.username || 'Guest'
		},
	},
	mounted() {
		console.log(this.authStore.userHomePageGetter);
		this.homePage = this.authStore.userHomePageGetter || 'home';
	},
	methods: {
		saveSettings() {
			this.authStore.updateUserHomePage(this.homePage);
			this.showEditForm = false;
		},
	},
}
</script>
