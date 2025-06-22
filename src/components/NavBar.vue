<template>

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
		<div class="menu-content" :class="{'mobile-hidden': !showNav}">
			<p class="menu-label mt-5">General</p>
			<ul class="menu-list">
				<li><RouterLink to="/" active-class="is-active">Home</RouterLink></li>
				<li><RouterLink to="dashboard" active-class="is-active">Dashboard</RouterLink></li>
				<li><RouterLink to="profile" active-class="is-active">Profile</RouterLink></li>
			</ul>
			<p class="menu-label">Planner</p>
				<ul class="menu-list">
				<!-- example of drop down menu:  -->
				<!-- <li class="">
					<a class="has-arrow is-flex is-align-items-center is-justify-content-space-between" @click="toggleSection('layout')">
						<span>Manage Your Team</span>
						<span class="icon is-small align-middle">
							<MUI name="chevron_forward" class="mui-icon" :class="sections.layout ? 'rotated' : ''" size=24 fill=0 weight=400 style="padding-top:4px"></MUI>
						</span>
					</a>
					<ul v-show="sections.layout">
						<li><RouterLink to="members" active-class="is-active">Members</RouterLink></li>
						<li><RouterLink to="plugins" active-class="is-active">Plugins</RouterLink></li>
						<li><RouterLink to="add" active-class="is-active">Add a member</RouterLink></li>
					</ul>
				</li> -->
				<li><RouterLink to="cycleplanner" active-class="is-active">Cycle Planner</RouterLink></li>
				<li><RouterLink to="cyclecalendar" active-class="is-active">Cycle Calendar</RouterLink></li>
				
			</ul>
			<p class="menu-label">Tools</p>
			<ul class="menu-list">
				<li><RouterLink to="dosagecalc" active-class="is-active">Dosage Calculator</RouterLink></li>
				<li><RouterLink to="vialcalc" active-class="is-active">Weekly Vial Calculator</RouterLink></li>
			</ul>
			<p class="menu-label">Account</p>
			<ul class="menu-list">
				<li><RouterLink to="settings" active-class="is-active">Settings</RouterLink></li>
				<li><RouterLink to="login" active-class="is-active">Login</RouterLink></li>
				<li><RouterLink to="logout" active-class="is-active">Logout</RouterLink></li>
			</ul>
		</div>
	</aside>
</template>

<script>
export default {
    name: 'NavBar',
    data() {
            return {
                sections: {
                    elements: false,
                    components: true, // Start with components expanded
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
    }
  }
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

/* Mobile burger button container */
.mobile-burger-container {
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 35;
	transition: transform 0.4s ease;
}

.desktop-burger {
    display: none;
}

/* Menu overlay for mobile */
.menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 25;
}

/* Mobile styles */
@media screen and (max-width: 1023px) {
    .mobile-burger-container {
        display: block;
    }
    
    .menu-content.mobile-hidden {
        display: none;
    }
	.mobile-burger-container.is-active {
		transform: translateX(400%)
	}
    
    .menu {
        transform: translateX(-100%);
        z-index: 30;
    }
    
    .menu.is-open {
        transform: translateX(0);
    }
    
    .menu-overlay.is-active {
        display: block;
    }
}


</style>