<template>
	<span
		class="icon-wrapper"
		ref="wrapper"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave"
		@click="onClick"
	>
		<i :class="iconClass" />
		<div v-if="showTooltip" class="tooltip">{{ message }}</div>
	</span>
</template>

<script>
export default {
	name: 'TooltipIcon',
	props: {
		hasItem: {
		type: Boolean,
		required: true
		}
	},
	data() {
		return {
		showTooltip: false,
		hideTimer: null,
		isDesktop: false
		}
	},
	computed: {
		iconClass() {
		return this.hasItem
			? 'fa-solid fa-circle-check has-text-success'
			: 'fa-solid fa-circle-xmark has-text-danger'
		},
		message() {
			return this.hasItem
				? 'You have this in inventory'
				: 'You do not have this in inventory'
		}
	},
	mounted() {
		this.checkIsDesktop()
		window.addEventListener('resize', this.checkIsDesktop)
		document.addEventListener('click', this.handleClickOutside)
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.checkIsDesktop)
		document.removeEventListener('click', this.handleClickOutside)
		clearTimeout(this.hideTimer)
	},
	methods: {
		checkIsDesktop() {
			this.isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches
		},
		show() {
			this.showTooltip = true
		clearTimeout(this.hideTimer)
			this.hideTimer = setTimeout(() => {
				this.showTooltip = false
			}, 2500)
		},
		onMouseEnter() {
			if (this.isDesktop) this.show()
		},
		onMouseLeave() {
			if (this.isDesktop) this.showTooltip = false
		},
		onClick() {
			if (!this.isDesktop) {
				this.show()
			}
		},
		handleClickOutside(e) {
			if (this.$refs.wrapper && !this.$refs.wrapper.contains(e.target)) {
				this.showTooltip = false
				clearTimeout(this.hideTimer)
			}
		}
	}
}
</script>

<style scoped>
.icon-wrapper {
	position: relative;
	display: inline-block;
	cursor: pointer;
}

.tooltip {
	position: absolute;
	top: -1.8rem;
	left: 50%;
	transform: translateX(-50%);
	background: #363636;
	color: white;
	padding: 0.25rem 0.5rem;
	font-size: 0.75rem;
	border-radius: 0.25rem;
	white-space: nowrap;
	z-index: 10;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
