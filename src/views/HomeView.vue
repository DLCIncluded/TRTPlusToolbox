<script>
</script>

<template>
	
	<main class="container">
		<aside class="menu">
			<p class="menu-label">General</p>
			<ul class="menu-list">
				<li><a>Dashboard</a></li>
				<li><a>Customers</a></li>
			</ul>
			<p class="menu-label">Administration</p>
			<ul class="menu-list">
				<li><a>Team Settings</a></li>
				<li class="">
					<a class="is-active has-arrow is-flex is-align-items-center is-justify-content-space-between" @click="toggleSection('layout')">
						<span>Manage Your Team</span>
						<span class="icon is-small align-middle">
							<MUI :name="sections.layout ? 'keyboard_arrow_down' : 'chevron_forward'" size=24 fill=0 weight=400 style="padding-top:4px"></MUI>
						</span>
					</a>
						<ul v-show="sections.layout">
							<li><a>Members</a></li>
							<li><a>Plugins</a></li>
							<li><a>Add a member</a></li>
						</ul>
				</li>
				<li><a>Invitations</a></li>
				<li><a>Cloud Storage Environment Settings</a></li>
				<li><a>Authentication</a></li>
			</ul>
			<p class="menu-label">Transactions</p>
			<ul class="menu-list">
				<li><a>Payments</a></li>
				<li><a>Transfers</a></li>
				<li><a>Balance</a></li>
			</ul>
		</aside>
		<div class="content is-widescreen">
			<h1 class="title">Welcome to the TRT+ Toolbox</h1>
			<p>This is a simple sidebar example using Bulma.</p>
			<p>Click on the sections to expand or collapse them.</p>
		</div>
	</main>	
</template>

<script>
import MUI from '@/components/icons/MUI.vue'
export default {
  name: 'BulmaDocsSidebar',
  components: {
	MUI
  },
  data() {
    return {
      sections: {
        elements: false,
        components: true, // Start with components expanded
        form: false,
        layout: false
      }
    }
  },
  methods: {
    toggleSection(section) {
      this.sections[section] = !this.sections[section]
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
  height: 100%;
  overflow-y: auto;
}
/* .align-middle {
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
} */
</style>