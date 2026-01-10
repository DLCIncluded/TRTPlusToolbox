<template>
	<div class="container syringe-scale my-6">
		<div class="has-text-centered is-size-4 has-text-weight-semibold mb-4">
		{{ textDisplay }}
		</div>

		<div
			class="box is-relative scale-container"
			@mousemove="handleMouseMove"
			@mouseleave="handleMouseLeave"
			ref="scaleRef"
		>
		<!-- Scale markers -->
		<div class="scale-markers">
			<template v-for="marker in markers" :key="marker.value">
			<div
				class="marker"
				:class="{ 'is-major': marker.isMajor }"
				:style="{
				left: `${(marker.value / maxValue) * 100}%`,
				height: marker.isMajor ? '24px' : '16px'
				}"
			>
				<div
				v-if="marker.isMajor"
				class="marker-label"
				>
				{{ marker.value / modifierAmount }}
				</div>
			</div>
			</template>
		</div>

		<!-- Filled amount indicator -->
		<div
			class="filled-amount"
			:style="{ width: `${valuePercentage}%` }"
		></div>

		<!-- Current value marker -->
		<div
			class="current-value"
			:style="{ left: `${valuePercentage}%` }"
		></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SyringeScale',
	props: {
		value: { type: Number, default: 10 },
		maxValue: { type: Number, default: 100 },
		unit: { type: String, default: 'units' }
	},
	data() {
		return {
		hoverPosition: null,
		scaleRef: null
		}
	},
	computed: {
		textDisplay() {
			if (this.value * 100 > this.maxValue) {
				const fullsyringes = Math.floor(this.value * 100 / this.maxValue);
				let extrasyringe = +((this.value * 100 / this.maxValue) - fullsyringes).toFixed(2);
				const remainder = +(this.maxValue % (this.value * 100)).toFixed(2);
				if (this.unit === 'units') {
					extrasyringe *= 100;
				}

				const addS = fullsyringes > 1 ? 's' : '';
				return extrasyringe === 0
				? `${fullsyringes}x Full Syringe${addS}`
				: `${fullsyringes}x Full Syringe${addS} + 1x ${extrasyringe} ${this.unit}`;
			}
			return `${this.valueWithModifier} ${this.unit}`;
		},
		valueWithModifier() {
			return this.unit === 'units' ? (this.value * 100).toFixed(0) : this.value;
		},
		modifierAmount() {
			return this.unit === 'units' ? 1 : 100;
		},
		valuePercentage() {
			if (this.value * 100 > this.maxValue) {
				let extrasyringe = +((this.value * 100 / this.maxValue) % 1).toFixed(2);
				// if (this.unit === 'units') extrasyringe *= 100;
				return extrasyringe === 0 ? 100 : extrasyringe * 100;
			}
			return Math.min(((this.value * 100 / this.maxValue) * 100), 100);
		},
		markers() {
			const markers = [];
			const majorInterval = this.getMajorInterval();
			const minorInterval = majorInterval / 5;
			for (let i = 0; i <= this.maxValue; i += minorInterval) {
				markers.push({ value: i, isMajor: i % majorInterval === 0 });
			}
			return markers;
		}
	},
	methods: {
		getMajorInterval() {
		if (this.maxValue <= 100) return 10;
		if (this.maxValue <= 300) return 50;
		return Math.ceil(this.maxValue / 10);
		},
		handleMouseMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		this.hoverPosition = (x / rect.width) * this.maxValue;
		},
		handleMouseLeave() {
		this.hoverPosition = null;
		}
	}
	}
</script>

<style scoped>
.scale-container {
	margin-left: 0!important;
	padding-left: 0!important;
	position: relative;
	height: 80px;
	background-color: #3b3b3b;
	border-radius: 8px;
	overflow: hidden;
}

.scale-markers {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 10;
	margin-top: 8px;
}

.marker {
	position: absolute;
	top: 0;
	width: 1px;
	background-color: #b5b5b5;
}

.marker-label {
	position: absolute;
	top: 26px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 0.75rem;
	color: #7a7a7a;
}

.filled-amount {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	background-color: rgba(33, 150, 243, 0.3);
	border-top-left-radius: 8px;
	border-bottom-left-radius: 8px;
}

.current-value {
	position: absolute;
	top: 0;
	width: 2px;
	height: 100%;
	background-color: #3273dc;
}
</style>
