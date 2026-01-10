<template>
	<div class="box">
		Note: The calendar view can be slow to load/navigate, please be patient.
		<vue-cal
		ref="calendar"
		v-model:view="view"
		:key="cycleEvents.length"
		style="height: 600px"
		:events="cycleEvents"
		:time="false"
		:views="['month', 'week', 'day']"
		:on-event-click="handleEventClick"
		events-on-month-view
		@view-change="onViewChange"
		:dark=true
		click-to-navigate
		:start-week-on-sunday=true
		>
			<!-- <template #cell="{ cell,events }" >
				<div class="custom-cell-content" v-if="view === 'month'">
					<div class="day-number">{{ new Date(cell.start).getDate() }}</div>
					<!-- <pre>{{ cell }}</pre> -->
					<!-- {{ events }} -->
					<!-- <div class="mini-dot-row">
						<div
						v-for="(event, i) in cell.events"
						:key="i"
						class="mini-dot"
						:style="{ backgroundColor: getEventColor(event) }"
						/>
					</div> -->
				<!-- </div>
			</template> --> 
		</vue-cal>
	</div>
</template>

<script>
import { VueCal } from 'vue-cal'
import 'vue-cal/style'

export default {
	name: 'CycleCalendar',
	components: { VueCal },
	data() {
		return {
			view: 'week',
			selectedDate: new Date(),
			cycleEvents: []
		};
	},

	props: {
		cycle: {
			type: Object,
			required: true
		},
		startDate: {
			type: String,
			required: true
		}
	},
	mounted() {
		this.generateCycleEvents();
	},
	methods: {
		onViewChange(viewObj) {
			console.log('View changed to:', viewObj);
			this.view = viewObj.id || 'month';
		},
		generateCycleEvents() {
			const events = [];
			const compoundData = this.cycle.compoundData;
			const weeks = parseInt(this.cycle.weeks);
			console.log("startDate:", this.startDate, "weeks:", weeks);

			const compoundMetaMap = Object.fromEntries(
				this.cycle.activeCompounds.map(c => [c.id, c])
			);

			for (const [compoundId, data] of Object.entries(compoundData)) {
				console.log(`Processing compound: ${compoundId}`, data);
				const meta = compoundMetaMap[compoundId] || {};
				events.push(...this.generateEventsForCompound(compoundId, data, weeks, meta));
			}
			console.log("Generated events:", events);
			if (events.length === 0) {
				console.warn("No events generated for the cycle.");
			}

			events.sort((a, b) => a.title.localeCompare(b.title));

			this.cycleEvents = events;
		},
		generateEventsForCompound(id, compound, weeks, meta) {
			const events = [];
			const start = new Date(this.startDate + 'T00:00:00'); // Local-safe
			const totalDays = weeks * 7;
			const { dosesPerWeek, color, concentration, weeklyDoses } = compound;
			const name = meta.name || id;

			const doseDays = new Set(({
				1: [0],               // Sun
				2: [0, 3],            // Sun, Wed
				3: [0, 2, 4],         // Sun, Tue, Thu
				4: [0, 2, 4, 6],      // Sun, Tue, Thu, Sat
				5: [1, 2, 3, 4, 5],   // Mon-Fri
				7: [0, 1, 2, 3, 4, 5, 6] // Every day
			})[dosesPerWeek] || []);

			for (let i = 0; i < totalDays; i++) {
				const date = new Date(start);
				date.setDate(start.getDate() + i);
				const dow = date.getDay();
				if (!doseDays.has(dow)) continue;

				const msPerDay = 1000 * 60 * 60 * 24;
				const daysSinceStart = Math.floor((date - start) / msPerDay);
				const weekNumber = Math.floor(daysSinceStart / 7) + 1;

				const doseWeekKey = Object.keys(weeklyDoses || {})
					.map(Number)
					.filter(k => k <= weekNumber)
					.sort((a, b) => b - a)[0];

				if (doseWeekKey === undefined) continue;

				const weeklyMg = weeklyDoses[doseWeekKey];

				const mgPerInjection = weeklyMg / dosesPerWeek;
				const ml = mgPerInjection / concentration;
				const formattedMl = `${ml.toFixed(2)} mL`;

				events.push({
					start: new Date(date),
					end: new Date(date.getTime() + 60 * 60 * 1000),
					title: `💉 ${ name }`,
					name: name,
					content: formattedMl,
					class: `compound-event ${id.replace(/_/g, '-')}`,
					style: `background-color: ${color}; color: white;`,
					backgroundColor: color
				});
			}

			events.sort((a, b) => a.name.localeCompare(b.name));

			return events;
		},


		getEventColor(event) {
			return event.backgroundColor || '#999';
		},
		handleEventClick(event) {
			alert(`${event.title}\n${event.content}\nDate: ${event.start}`);
		},
		// handleCellClick({ cell }) {
		// 	if (!cell?.start) return;

		// 	const date = new Date(cell.start);

		// 	// this.selectedDate = date;
		// 	// this.view = 'day';
		// 	console.log('Cell clicked:', date);

		// 	this.$refs.calendar.view.switch('day', new Date());
		// }

	}
}
</script>

<style>
.vuecal__event.compound-event {
  margin-top: 5px;
  border-radius: 8px;
  padding: 6px;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  text-align: center;
  border: 1px solid #222;
  white-space: normal;
  word-wrap: break-word;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  position: relative !important; /* Ensure proper stacking */
  left: 0 !important;
  width: 100% !important;
  margin-bottom: 4px;
}

/* Example compound-specific overrides */
.vuecal__event.test-cyp {
  background-color: #4F46E5;
}

.vuecal__event.primo-inj {
  background-color: #EA580C;
}

.custom-cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
}
.day-number {
  font-size: 0.75rem;
  font-weight: 600;
  color: white !important;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 4px;
}
.mini-dot-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
}
.mini-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

</style>
