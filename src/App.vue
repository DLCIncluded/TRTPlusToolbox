<script >
</script>

<template>

	<!-- Mobile menu overlay -->
	<div class="menu-overlay" :class="{'is-active': showNav}" @click="showNav = false"></div>
	
	<main class="container mt-6 p-3">

		<NavBar />

		<div class="content is-widescreen">
			<RouterView />
		</div>
	</main>
	
</template>

<script>
import MUI from '@/components/icons/MUI.vue'
import NavBar from '@/components/NavBar.vue'


export default {
    name: 'TRTPlusToolbox',
    components: {
		MUI, 
		NavBar
    },
    data() {
            return {
                
            }
    },
	
    methods: {
    }
}
</script>

