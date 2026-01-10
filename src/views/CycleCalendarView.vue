<script>
import CycleCalendar from '@/components/CycleCalendar.vue';
import { useToast } from "vue-toastification";
const toast = useToast();
import { useAuthStore } from '@/stores/auth'
import { useCycleStore } from '@/stores/cycle'
export default {
	name: 'HomeView',
	components: {
		CycleCalendar
	},
	data() {
		return {
			authStore: useAuthStore(),
			cycleStore: useCycleStore(),
			selectedCycle: this.loadFromStorage('trt-selectedCycle', ''),
			cycle: {},
			isloading: true,
		}
	},
	methods: {
		loadFromStorage(key, defaultValue) {
			const saved = localStorage.getItem(key)
			if (saved !== null) {
				try {
					return JSON.parse(saved)
				} catch (e) {
					return saved
				}
			}
			return defaultValue
		
		},
		async loadCycles() {
			if (!this.authStore.isAuthenticated) {
				console.log('Not authenticated, skipping cycle load')
				return
			}
			
			try {
				const result = await this.cycleStore.loadCycles()
				console.log('Store loadCycles result:', result)
				console.log('Store cycles after load:', this.cycleStore.cycles)
				
				// Wait for the store to be populated
				if (this.cycleStore.cycles && this.cycleStore.cycles.length > 0) {
					this.cycles = this.cycleStore.cycles.map(cycle => ({
						id: cycle.id,
						cycle_name: cycle.title,
						title: cycle.title,
						cycle: cycle.data
					}))
					console.log('Loaded cycles:', this.cycles)
				} else {
					console.log('No cycles returned from store')
					this.cycles = []
				}
			} catch (error) {
				console.error('Error loading cycles:', error)
				toast.error('Failed to load cycles')
			}
		},
		async loadLastSelectedCycle() {
			// Get the last selected cycle ID from localStorage
			const lastCycleId = localStorage.getItem('lastSelectedCycleId')
			
			console.log('Debug: lastSelectedCycleId from localStorage:', lastCycleId)
			console.log('Debug: available cycles length:', this.cycles.length)
			console.log('Debug: available cycles:', this.cycles)
			
			if (!lastCycleId) {
				console.log('No last selected cycle found in localStorage')
				toast.error('No cycle selected for calendar view')
				this.isloading = false
				return
			}
			
			// Check if cycles are loaded
			if (!this.cycles || this.cycles.length === 0) {
				console.log('No cycles available yet, skipping auto-load')
				this.isloading = false
				return
			}
			
			// Check if the cycle exists in the loaded cycles
			const savedCycle = this.cycles.find(c => c.id === parseInt(lastCycleId))
			
			console.log('Debug: looking for cycle with id:', parseInt(lastCycleId))
			console.log('Debug: found savedCycle:', savedCycle)
			
			if (savedCycle) {
				console.log('Auto-loading last selected cycle for calendar:', savedCycle.title)
				this.selectedCycleId = savedCycle.id
				this.cycle = { ...savedCycle.cycle, id: savedCycle.id, title: savedCycle.title }
				toast.success(`Loaded cycle for calendar: ${savedCycle.title}`)
				this.isloading = false
			} else {
				console.log('Last selected cycle not found in available cycles, clearing localStorage')
				localStorage.removeItem('lastSelectedCycleId')
				toast.error('Selected cycle no longer exists')
				this.isloading = false
			}
		},
	},
	async mounted() {
		// Initialize with new auth system
		console.log('Auth status:', {
			isAuthenticated: this.authStore.isAuthenticated,
			hasToken: !!localStorage.getItem('auth_token'),
			user: this.authStore.user
		})
		
		// Load cycles if user is authenticated
		if (this.authStore.isAuthenticated) {
			console.log('Loading cycles for authenticated user...')
			try {
				await this.loadCycles()
				
				// Wait for next tick and add a small delay to ensure reactivity has updated
				await this.$nextTick()
				
				// Wait a bit more to ensure the API response has been processed
				setTimeout(async () => {
					console.log('Attempting auto-load after delay, cycles length:', this.cycles.length)
					if (this.cycles.length > 0) {
						await this.loadLastSelectedCycle()
					} else {
						console.log('Still no cycles after delay, skipping auto-load')
						toast.error('No cycles available for calendar view')
						this.isloading = false
					}
				}, 100)
			} catch (error) {
				console.error('Error during cycle loading:', error)
				this.isloading = false
			}
		} else {
			console.log('User not authenticated, skipping cycle loading')
			toast.error('Please log in to view cycle calendar')
			this.isloading = false
		}
	},								
}


</script>

<template>
	<CycleCalendar :cycle="cycle" :startDate="cycle.startDate" v-if="!isloading"/>
</template>