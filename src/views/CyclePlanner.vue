<template>
	<div>
		<h1 class="title has-text-centered">Cycle Planner</h1>
	</div>
	<article class="panel is-primary">
		<p class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			<span>Settings</span>
			 <span class="icon is-clickable" @click="showSettings = !showSettings">
				<i :class="['fas', showSettings ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
			</span>
		</p>

		
		<div class="panel-block fixed-grid has-1-cols-mobile has-5-cols-desktop" v-show="showSettings">
			<div class="grid">
				<div class="field cell">
					<label class="label">Length</label>
					<div class="control has-icons-left has-icons-right">
						<div class="select is-fullwidth">
							<select name="cycle" v-model="weeks">
								<option v-for="w in [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52]" :value="w">{{w}} Weeks</option>
							</select>
						</div>
						<span class="icon is-small is-left">
						<i class="fas fa-calendar"></i>
						</span>
					</div>
				</div>
				<div class="field cell">
					<label class="label">Full Bloodwork Cost</label>
					<div class="control has-icons-left has-icons-right">
						<input class="input" type="number" placeholder="ex: 299">
						<span class="icon is-small is-left">
						<i class="fas fa-dollar"></i>
						</span>
						<span class="icon is-small is-right">
						<i class="fas fa-syringe"></i>
						</span>
					</div>
					<p class="help"><a href="https://www.algodx.ai/lab-packages/bodybuilder-organ-panel" target="_blank" rel="noopener noreferrer">AlgoDX BB Organ<span class="icon is-small"><i class="fas fa-share"></i></span></a> Code CHASE</p>
				</div>
				<div class="field cell">
					<label class="label">Follow Up Bloodwork Cost</label>
					<div class="control has-icons-left has-icons-right">
						<input class="input" type="number" placeholder="ex: 159">
						<span class="icon is-small is-left">
						<i class="fas fa-dollar"></i>
						</span>
						<span class="icon is-small is-right">
						<i class="fas fa-syringe"></i>
						</span>
					</div>
					<p class="help"> <a href="https://www.algodx.ai/lab-packages/bodybuilder-follow-up-panel" target="_blank" rel="noopener noreferrer">AlgoDX BB Follow-Up<span class="icon is-small"><i class="fas fa-share"></i></span></a> Code Chase</p>
				</div>
				<div class="field cell">
					<label class="label">Preferred Bloodwork Day</label>
					<div class="control has-icons-left has-icons-right">
						<div class="select is-fullwidth">
							<select name="bloodworkday" v-model="bloodworkDay">
								<option value="0">Sunday</option>
								<option value="1">Monday</option>
								<option value="2">Tuesday</option>
								<option value="3">Wednesday</option>
								<option value="4">Thursday</option>
								<option value="5">Friday</option>
								<option value="6">Saturday</option>
							</select>
						</div>
						<span class="icon is-small is-left">
						<i class="fas fa-calendar"></i>
						</span>
					</div>
				</div>
				<div class="field cell">
					<label class="label"> Preferred Blood Work Week</label>
					<div class="control has-icons-left has-icons-right">
						<div class="select is-fullwidth">
							<select name="bloodworkweek" v-model="bloodworkWeek">
								<option value="1">Week 1</option>
								<option value="2">Week 2</option>
								<option value="3">Week 3</option>
								<option value="4">Week 4</option>
							</select>
						</div>
						<span class="icon is-small is-left">
						<i class="fas fa-calendar"></i>
						</span>
						<p class="help">Week in block to get bloodwork done</p>
					</div>
				</div>
			</div>
		</div>
		<div class="panel-block" v-if="!showSettings">
			<!-- empty to give the  bottom rounded border when settings panel closed -->
		</div>

	</article>

	<!-- New or Load panel-->
	<article class="panel is-primary">
		<p class="panel-heading">New or Load</p>

		<!-- <div class="panel-block">
			<div class="buttons is-centered">
				<button class="button is-primary" @click="saveLoadTab = 'new'">New Cycle</button>
				<button class="button is-primary" @click="saveLoadTab = 'load'">Load Cycle</button>
				
			</div>
		</div> -->
		<p class=" mb-0 pb-0 panel-tabs">
			<a :class="saveLoadTab === 'new' ? 'is-active has-text-white' : 'has-text-primary-light'" @click.prevent="saveLoadTab = 'new'">
				New
			</a>
			<a :class="saveLoadTab === 'load' ? 'is-active has-text-white' : 'has-text-primary-light'" @click.prevent="saveLoadTab = 'load'">
				Load
			</a>
		</p>
		<div class="panel-block" v-show="saveLoadTab === 'new' || (saveLoadTab !== 'load' && selectedCycle === '')">
			<div>
				<p class="">Create a new cycle from scratch.</p>
				<p class="">This will allow you to plan your cycle with the settings you have configured.</p>
				<div class="grid">
					<div class="field cell">
						<label class="label">Name</label>
						<div class="control">
							<input class="input" type="text" placeholder="ex: TRT" v-model="cycleName">
						</div>
					</div>
				</div>
				<div class="buttons is-centered">
					<button class="button is-success" @click="createNew">Create</button>
					<button class="button is-error" @click="saveLoadTab='';newName=''">Cancel</button>
				</div>
			</div>
			
		</div>
		<div class="panel-block" v-show="saveLoadTab === 'load'">
			<div>
				<p class="">Load a cycle from your saved cycles.</p>
				<p class="">This will allow you to quickly access and modify your existing cycles.</p>
				<div class="grid">
					<div class="field cell">
						<label class="label">Select Cycle</label>
						<div class="control">
							<div class="select is-fullwidth">
								<select v-model="selectedCycle">
									<option value="" disabled selected>Select a cycle</option>
									<option v-for="cycle in ['Cycle 1', 'Cycle 2', 'Cycle 3']" :key="cycle">{{ cycle }}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="buttons is-centered">
					<button class="button is-success" @click="loadCycle">Load</button>
					<button class="button is-error" @click="saveLoadTab=''">Cancel</button>
				</div>

			</div>
		</div>
	</article>

	<div>
		<h1 class="title has-text-centered">{{ selectedCycle }}</h1>
	</div>

	<article class="panel is-primary" v-if="selectedCycle">
		<p class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			Add Compound
		</p>
		<div class="panel-block">
			<div class="field has-addons">
				<div class="control has-icons-left has-icons-right">
					<div class="select is-fullwidth">
						<select 
							v-model="selectedCompound"
							class=""
						>
							<option disabled>Select</option>
							<option 
								v-for="type in availableToAdd" 
								:key="type.id" 
								:value="type.id"
							>
							{{ type.name }} {{ type.ester }}
							</option>
						</select>
					</div>
					<span class="icon is-small is-left">
						<i class="fas fa-syringe"></i>
					</span>
				</div>
				<div class="control">
					<button 
						@click="addSelectedCompound"
						class="button is-success"
						:disabled="!selectedCompound"
					>
						Add
					</button>
				</div>
					
			</div>
			
			
		</div>

		<div class="panel-block fixed-grid has-1-cols-mobile has-3-cols-desktop">
			<div class="grid is-gap-4.5">

				<div v-for="compound in activeCompounds" :key="compound.id" class="cell box ">
					<!-- HGH specific data -->
					<div v-if="compound.id =='hgh'">
						<div class="is-flex is-justify-content-flex-end">
							<button 
								type="button" 
								@click="removeCompound(compound.id)" 
								class="button is-danger is-small"
							>
								<i class="fa-solid fa-x"></i>
							</button>
						</div>
						<div class="is-flex is-justify-content-space-between is-align-items-center mb-2 ">
							<h2 class="">{{ compound.name }} {{ compound.ester }}</h2>
						</div>
						<div class="columns is-multiline ">
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">iu in pen/vial</label>
								<div class="control has-icons-right">
									<input 
										type="number" 
										v-model="compoundData[compound.id].mg"
										class="input no-spinner"
										min="0"
										@input="calculatehgh"
									>
									<span class="" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%)">
										<i>iu</i>
									</span>
								</div>
							</div>
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">mL in pen/vial</label>
								<div class="control has-icons-right">
									<input 
										type="number" 
										v-model="compoundData[compound.id].ml" 
										class="input no-spinner"
										min="0"
										@input="calculatehgh"
									>
									<span class="icon is-small is-right">
										<i>mL</i>
									</span>
								</div>
							</div>
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">Vial/Pen Cost</label>
								<div class="control has-icons-left">
									<input 
										type="number" 
										v-model="compoundData[compound.id].vialCost" 
										class="input no-spinner"
										min="0"
										@input="calculatehgh"
									>
									<span class="icon is-small is-left">
										<i class="fas fa-dollar"></i>
									</span>
								</div>
							</div>
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">Doses Per Week</label>
								<select 
									v-model="compoundData[compound.id].dosesPerWeek"
									class="input"
								>
									<option value=1>1x/week aka "Every 7 days"</option>
									<option value=2>2x/week aka "Every 3.5 days"</option>
									<option value=3>3x/week aka "Every 3 days"</option>
									<option value=4>4x/week aka "Every Other Day"</option>
									<option value=7>7x/week aka "Every Day"</option>
								</select>
							</div>
							<div class="column is-half-desktop is-full-mobile" v-if="compoundData[compound.id].dosesPerWeek == 1">
								<label class="label">Day For Injection</label>
								<select 
									v-model="compoundData[compound.id].injectionDay"
									class="input"
								>
									<option value=0>Sunday</option>
									<option value=1>Monday</option>
									<option value=2>Tuesday</option>
									<option value=3>Wednesday</option>
									<option value=4>Thursday</option>
									<option value=5>Friday</option>
									<option value=6>Saturday</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Non-HGH compound data -->
					<div v-else >
						<div class="is-flex is-justify-content-flex-end">
							<button 
								type="button" 
								@click="removeCompound(compound.id)" 
								class="button is-danger is-small"
							>
								<i class="fa-solid fa-x"></i>
							</button>
						</div>
						<div class="is-flex is-justify-content-space-between is-align-items-center mb-2 ">
							<h2 class="">{{ compound.name }} {{ compound.esterShort }}</h2>
							
						</div>
						
						<div class="columns is-multiline ">
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">Concentration</label>
								<div class="control has-icons-right">
									<input 
										type="number" 
										v-model="compoundData[compound.id].concentration" 
										class="input no-spinner"
										min="0"
									>
									<span class="" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%)">
										<i>mg/mL</i>
									</span>
								</div>
							</div>
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">Vial Amount</label>
								<div class="control has-icons-right">
									<input 
										type="number" 
										v-model="compoundData[compound.id].vialAmount" 
										class="input no-spinner"
										min="0"
									>
									<span class="icon is-small is-right">
										<i>mL</i>
									</span>
								</div>
							</div>
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">Vial Cost</label>
								<div class="control has-icons-left">
									<input 
											type="number" 
											v-model="compoundData[compound.id].vialCost" 
											class="input no-spinner"
										min="0"
									>
									<span class="icon is-small is-left">
										<i class="fas fa-dollar"></i>
									</span>
								</div>
							</div>
							<div class="column is-half-desktop is-full-mobile">
								<label class="label">Doses Per Week</label>
								<select 
									v-model="compoundData[compound.id].dosesPerWeek"
									class="input"
								>
									<option value=1>1x/week aka "Every 7 days"</option>
									<option value=2>2x/week aka "Every 3.5 days"</option>
									<option value=3>3x/week aka "Every 3 days"</option>
									<option value=4>4x/week aka "Every Other Day"</option>
									<option value=5>5x/week aka "M-F"</option>
									<option value=7>7x/week aka "Every Day"</option>
								</select>
							</div>
							<div class="column is-half-desktop is-full-mobile" v-if="compoundData[compound.id].dosesPerWeek == 1">
								<label class="label">Day For Injection</label>
								<select 
									v-model="compoundData[compound.id].injectionDay"
									class="input"
								>
									<option value=0>Sunday</option>
									<option value=1>Monday</option>
									<option value=2>Tuesday</option>
									<option value=3>Wednesday</option>
									<option value=4>Thursday</option>
									<option value=5>Friday</option>
									<option value=6>Saturday</option>
								</select>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	</article>


	
	<article class="panel is-primary" v-for="blockStart in weekBlocks" :key="blockStart" v-if="selectedCycle">
		<p class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			<span>Weeks {{ blockStart }}-{{ blockStart + 3 }}</span>
		</p>
		<p class="pt-4 pl-4">
			Weekly doses for each compound in this block. <br>
		</p>
		<div class="panel-block fixed-grid has-1-cols-mobile has-5-cols-desktop">
			<div class="grid">
				<div class="cell" v-for="compound in activeCompounds" :key="compound.id">
					<label class="label">{{ compound.name }} {{ compound.esterShort }}</label>
					<div class="field has-addons">
						
					
						<div class="control has-icons-left has-icons-right has-addons">
							<input class="input no-spinner" type="number" placeholder=""
								v-model="compoundData[compound.id].weeklyDoses[blockStart]" 
								min="0"
								@input="calculateDoses">
							<span class="icon is-small is-left">
							<i class="fas fa-syringe"></i>
							</span>
							<span class="icon is-small is-right" v-if="compound.id != 'hgh'">
								mg
							</span>
							<span class="icon is-small is-right" v-else>
								iu
							</span>
						</div>
						<div class="control" v-if="blockStart > 4">
							<button class="button is-info px-2" @click="copyDose(blockStart, compound.id)">
								<span style="font-size: 0.75rem; line-height: 2;">Copy {{ previousWeek(blockStart, compound.id) }} 
									<span v-if="compound.id != 'hgh'">mg</span>
									<span v-else>iu</span>
								</span>

							</button>
						</div>
					</div>
					<div class="mt-2">
						<button 
							@click="toggleDoseDetails(blockStart, compound.id)"
							class=""
						>
							{{ isDoseDetailsVisible(blockStart, compound.id) ? 'Hide' : 'Show' }} details
							<span class="text-xs">
								{{ isDoseDetailsVisible(blockStart, compound.id) ? '▼' : '▶' }}
							</span>
						</button>
						
						<div 
							v-if="isDoseDetailsVisible(blockStart, compound.id)"
							class=""
						>
							<div class="ml-4">
								<p class="mb-0">Per Injection:</p>
								<p class="mb-1 pl-2">{{ calculateDose(compound.id,compoundData[compound.id].weeklyDoses[blockStart]).mg }} <span v-if="compound.id != 'hgh'">mg</span><span v-else>iu</span></p>
								<p class="mb-1 pl-2">{{ calculateDose(compound.id,compoundData[compound.id].weeklyDoses[blockStart]).ml }} ml</p>
								<p class="mb-1 pl-2">{{ calculateDose(compound.id,compoundData[compound.id].weeklyDoses[blockStart]).units }} units</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>

	<article class="panel is-primary" v-if="selectedCycle">
		<p class="panel-heading">Summary</p>
		<div class="panel-block">
				<div class="container is-fluid w-full">
					<div class="columns is-4">
						<div class="column">
							<p><strong>Cycle Length:</strong></p>
							<p>{{ weeks }} weeks</p>
						</div>

						<div class="column">
							<p class="">Total Cost:</p>
							<p>${{ calculateTotalCost().toFixed(2) }}</p>
						</div>
						<div class="column">
							<p class="">Average Cost per Week:</p>
							<p>${{ (calculateTotalCost() / weeks).toFixed(2) }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="panel-block ">
				<div class="container is-fluid w-full">
					<div class="columns is-4">
						<div v-for="compound in activeCompounds" :key="compound.id" class="column">
							<div class="box has-background-black-ter">
								<p class="label">{{ compound.name }} {{ compound.esterShort }}</p>
								<p v-if="compound.id != 'hgh'" class="font-medium dark:text-white">Vials Needed:</p>
								<p v-else class="font-medium dark:text-white">Vials/Pens Needed:</p>
								<p v-if="compound.id !='hgh'">{{ calculateVialsNeeded(compound.id) }} ({{ compoundData[compound.id].vialAmount }}ml vial)</p>
								<p v-else>{{ calculateVialsNeeded(compound.id) }} (vials/pens)</p>
							</div>
						</div>
					</div>
				</div>	
				<!-- <div v-if="hasCompounds" class="mt-3">
					<RouterLink to="/calendar" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"><h3 class="text-xl font-semibold mb-4">View Calendar</h3></RouterLink>
				</div> -->
				<!-- <div v-if="showPlotterUrl" class="mt-3">
					<h3 class="text-xl font-semibold mb-4 dark:text-white">Steroid Plotter URL</h3>
					<div class="flex gap-2 items-start">
						<input 
							type="text" 
							:value="plotterUrl" 
							readonly
							class="flex-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
						>
						<button 
							@click="copyToClipboard(plotterUrl)"
							class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
						>
							Copy URL
						</button>
					</div>
					<a :href="plotterUrl" target="_blank" rel="noopener noreferrer">
						<label class="mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center cursor-pointer gap-1">Open in Steroid Plotter
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
						</label>
					</a>
				</div> -->

				<!-- <div v-if="hasGLP1" class="mt-6 dark:text-white">
					<h3 class="text-xl font-semibold mb-1 dark:text-white">GLP1 Plotter URL</h3>
					<p class="mb-4">This only shows if you added a GLP1, sema, tirz, or reta; It is better for visualizing these peptides than the Steroid Plotter.</p>
					<div class="flex gap-2 items-start">
						<input 
							type="text" 
							:value="plotterGLPUrl" 
							readonly
							class="flex-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
						>
						<button 
							@click="copyToClipboard(plotterGLPUrl)"
							class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
						>
							Copy URL
						</button>
					</div>
					<a :href="plotterGLPUrl" target="_blank" rel="noopener noreferrer">
						<label class="mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center cursor-pointer gap-1">Open in Steroid Plotter
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
						</label>
					</a>
				</div> -->
		</div>
	</article>

	<article class="panel is-primary">
		<p class="panel-heading">Debugging</p>
		<div class="panel-block">
			<p><strong>Name:</strong> {{ cycleName }}</p>
			<p><strong>Weeks:</strong> {{ weeks }}</p>
			<p><strong>Blood Work Costs:</strong> {{ bloodWorkCosts }}</p>
			
		</div>
		<div class="panel-block">
			<pre>{{ compoundData }}</pre>
		</div>
	</article>
</template>

<script>
import availableTypes from '@/assets/availableTypes.json'
import MUI from '@/components/icons/MUI.vue'
export default {
	name: 'HomeView',
	components: {
		MUI
	},
	data() {
		return {
			cycleName: '',
			saveLoadTab: 'main',
			bloodworkDay: 0,
			bloodworkWeek: 4,
			showSettings: false,
			selectedCycle: this.loadFromStorage('trt-selectedCycle', ''),
			weeks: this.loadFromStorage('trt-weeks', 16),
			bloodWorkCosts: this.loadFromStorage('trt-bloodWorkCosts', {
				bbOrgan: 299,
				bbFollowUp: 159
			}),
			// weeklyDoses: this.loadFromStorage('trt-weeklyDoses', {}),
			bloodWorkSchedule: this.loadFromStorage('trt-bloodWorkSchedule', {}),
			bloodWorkPreferredDay: this.loadFromStorage('trt-bloodWorkPreferredDay', 1),
			bloodWorkPreferredWeek: this.loadFromStorage('trt-bloodWorkPreferredWeek', 3),
			...availableTypes,
			cycleName: '',
			activeCompounds: this.loadFromStorage('trt-activeCompounds', []),
			compoundData: this.loadFromStorage('trt-compoundData', {}),
			selectedCompound: null,
			showDoseDetails: {},
			cycleToLoad: '',
			saves: null,
			cycleToDelete: ''
		}
	},
	computed: {
		hasCompounds() {
			return this.activeCompounds.length > 0
		},
		showPlotterUrl(){
			if (this.activeCompounds.length===1){
				if (this.activeCompounds.some(compound => compound.id === 'hgh')) return false;
			}
			return this.activeCompounds.length > 0
		},
		hasGLP1() {
			// show only peptides - excluding HGH
			return this.activeCompounds.some(compound => compound.category === 'peptides-glp')
		},
		plotterUrl() {
			return this.generatePlotterUrl();
		},
		plotterGLPUrl() {
			return this.generateGLPPlotterUrl();
		},
		weekBlocks() {
			const blocks = []
			for (let i = 1; i <= this.weeks; i += 4) {
				blocks.push(i)
			}
			return blocks
		},
		availableToAdd() {
			return this.availableTypes.filter(type => 
				!this.activeCompounds.find(compound => compound.id === type.id)
			)
		},
		
	},
	watch: {
		selectedCycle(newValue) {
			localStorage.setItem('trt-selectedCycle', JSON.stringify(newValue))
		},
		weeks: {
			handler(newValue) {
				localStorage.setItem('trt-weeks', JSON.stringify(newValue))
			},
			immediate: true
		},
		bloodWorkPreferredDay: {
			handler(newValue) {
				localStorage.setItem('trt-bloodWorkPreferredDay', JSON.stringify(newValue))
			},
			immediate: true
		},
		bloodWorkPreferredWeek: {
			handler(newValue) {
				localStorage.setItem('trt-bloodWorkPreferredWeek', JSON.stringify(newValue))
			},
			immediate: true
		},
		bloodWorkCosts: {
			handler(newValue) {
				localStorage.setItem('trt-bloodWorkCosts', JSON.stringify(newValue))
			},
			deep: true,
			immediate: true
		},
		// weeklyDoses: {
		// 	handler(newValue) {
		// 		localStorage.setItem('trt-weeklyDoses', JSON.stringify(newValue))
		// 	},
		// 	deep: true,
		// 	immediate: true
		// },
		bloodWorkSchedule: {
			handler(newValue) {
				localStorage.setItem('trt-bloodWorkSchedule', JSON.stringify(newValue))
			},
			deep: true,
			immediate: true
		},
		activeCompounds: {
			handler(newValue) {
				localStorage.setItem('trt-activeCompounds', JSON.stringify(newValue))
			},
			deep: true,
			immediate: true
		},
		compoundData: {
			handler(newValue) {
				localStorage.setItem('trt-compoundData', JSON.stringify(newValue))
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		loadFromStorage(key, defaultValue) {
			const saved = localStorage.getItem(key)
			return saved !== null ? JSON.parse(saved) : defaultValue
		},
		savedCycles(){
			const saves = []
			// Iterate through all localStorage keys
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i)
				if (key.startsWith('save-')) {
				saves.push({
					key: key,
					name: key.replace('save-', '') 
					// value: JSON.parse(localStorage.getItem(key))
				})
				}
			}
			this.saves = saves
		},
		createNew() {
			if (this.cycleName.trim() === '') {
				toast.error("Please enter a cycle name")
				return
			}
			this.selectedCycle = this.cycleName

			this.resetAllValues()
			toast.success("New Cycle Created!")
		},
		resetAllValues() {
			this.weeks = 12
			this.concentration = 200
			this.costPerVial = 100
			this.bloodWorkCosts = {
				bbOrgan: 299,
				bbFollowUp: 159
			}
			this.bloodWorkSchedule = {}
			this.activeCompounds = []
			this.compoundData = {}
			this.bloodWorkPreferredDay = 0
			this.bloodWorkPreferredWeek = 3
			this.saveLoadTab = 'main'
			toast.success("Everything Reset!")
		},
		toggleDoseDetails(blockStart, compoundId) {
			const key = `${blockStart}_${compoundId}`
			this.showDoseDetails[key] = !this.showDoseDetails[key]
		},
		isDoseDetailsVisible(blockStart, compoundId) {
			const key = `${blockStart}_${compoundId}`
			return this.showDoseDetails[key]
		},
		addSelectedCompound() {
			if (this.selectedCompound) {
				this.addCompound(this.selectedCompound)
				this.selectedCompound = null
			}
		},
		addCompound(typeId) {
			const typeInfo = this.availableTypes.find(t => t.id === typeId)
			if (!typeInfo) return

			// Add to active compounds
			this.activeCompounds.push({
				id: typeInfo.id,
				name: typeInfo.name,
				ester: typeInfo.ester,
				esterShort: typeInfo.esterShort,
				category: typeInfo.category,
				color: typeInfo.color,
			})

			// Initialize compound data with proper structure
			
			this.compoundData[typeInfo.id] = {
				concentration: typeInfo.defaultConcentration,
				weeklyDoses: {},
				vialAmount: typeInfo.defaultVialAmount,
				vialCost: typeInfo.defaultVialCost,
				dosesPerWeek:7,
				color: typeInfo.color,
			}

			if (typeInfo.id == 'hgh'){
				this.compoundData[typeInfo.id].mg = typeInfo.mg
				this.compoundData[typeInfo.id].ml = typeInfo.ml
				this.compoundData[typeInfo.id].isngenla = typeInfo.isngenla
				this.compoundData[typeInfo.id].concentrationmg = typeInfo.concentrationmg
				this.compoundData[typeInfo.id].concentrationiu = typeInfo.concentrationiu
				this.compoundData[typeInfo.id].pentotaliu = typeInfo.pentotaliu
				this.compoundData[typeInfo.id].pentotalmg = typeInfo.pentotalmg
			}

			// Pre-initialize weekly doses for all blocks to 0
			this.weekBlocks.forEach(blockStart => {
				this.compoundData[typeInfo.id].weeklyDoses[blockStart] = 0
			})
			this.selectedCompound = null
			toast.success(typeInfo.name+" Added!")
		},
		removeCompound(compoundId) {
			const index = this.activeCompounds.findIndex(c => c.id === compoundId)
			if (index !== -1) {
				let compoundName = this.activeCompounds[index].name

				this.activeCompounds.splice(index, 1)

				
				toast.success(compoundName+" Removed!")
				delete this.compoundData[compoundId]
			}
		},
		convertDoseScheduleToPlotter(dosesPerWeek) {
			const scheduleMap = {
				1: "7",		// 1x/week ="Every 7 days"
				2: "3.5",	// 2x/week = "Every 3.5 days"
				3: "3",		// 3x/week = "Every 3 days"
				4: "2",		// 4x/week = "Every Other Day"
				7: "1",		// 7x/week = "Every Day"
			};

			return scheduleMap[dosesPerWeek] || "1"; // Default to 1x/week if no match
		},
		generatePlotterUrl() {
			const baseUrl = "https://steroidplotter.com/?";
			const urlParams = [];
			const blockCount = Math.ceil(this.weeks / 4);
			
			for (let i = 0; i < blockCount; i++) {
				const startWeek = i * 4 + 1;
				const endWeek = Math.min((i + 1) * 4, this.weeks); // Ensure we don't exceed total weeks
				
				// Only pull glp1 and steroids for steroid plotter url
				this.activeCompounds.filter(compound => compound.category === "peptides-glp" || compound.category === "steroids").forEach((compound, compoundIndex) => {
					// Get the weekly dose for this block and compound
					const weeklyDose = this.compoundData[compound.id]?.weeklyDoses[startWeek] || 0;

					const dosesPerWeek = this.compoundData[compound.id].dosesPerWeek;
					
					// Calculate the parameter number (increases for each compound in each block)
					const paramNum = i + 1 + (compoundIndex * blockCount);
					
					const plotterSchedule = this.convertDoseScheduleToPlotter(dosesPerWeek);

					// Build the parameter string 
					const blockParams = [
						`c${paramNum}=${compound.category.toLowerCase().replace("-glp", '')}`, // removing the -glp1 as they only call them 'peptides', and we differentiate
						`m${paramNum}=${compound.name.toLowerCase()}`,
						`g${paramNum}=${compound.ester.toLowerCase()}`,
						`o${paramNum}=0`,
						`d${paramNum}=${weeklyDose/dosesPerWeek}`,
						`f${paramNum}=${startWeek}`,
						`e${paramNum}=${endWeek}`,
						`q${paramNum}=${plotterSchedule}`,
						`p${paramNum}=false`,
						`b${paramNum}=0`
					].join('&');
					
					urlParams.push(blockParams);
				});
			}
			
			// Add the final parameters
			urlParams.push(`l=${this.weeks}`);
			urlParams.push('t=TRT%2B');
			urlParams.push('a=Anon');
			
			// Combine into final URL
			const finalUrl = baseUrl + urlParams.join('&');
			return finalUrl;
		},
		convertDoseScheduleToGLPPlotter(dosesPerWeek) {
			const scheduleMap = {
				1: "7",		// 1x/week ="Every 7 days"
				2: "3.5",	// 2x/week = "Every 3.5 days"
				3: "3",		// 3x/week = "Every 3 days"
				4: "2",		// 4x/week = "Every Other Day"
				7: "1",		// 7x/week = "Every Day"
			};

			return scheduleMap[dosesPerWeek] || "1"; // Default to 1x/week if no match
		},
		generateGLPPlotterUrl() {
			const baseUrl = "https://glp1plotter.com/?";
			const urlParams = [];
			const blockCount = Math.ceil(this.weeks / 4);
			
			for (let i = 0; i < blockCount; i++) {
				const startWeek = i * 4 + 1;
				const endWeek = Math.min((i + 1) * 4, this.weeks); // Ensure we don't exceed total weeks
				
				// For each glp1
				this.activeCompounds.filter(compound => compound.category === "peptides-glp").forEach((compound, compoundIndex) => {
					// Get the weekly dose for this block and compound
					const weeklyDose = this.compoundData[compound.id]?.weeklyDoses[startWeek] || 0;

					const dosesPerWeek = this.compoundData[compound.id].dosesPerWeek;
					// console.log(dosesPerWeek)
					
					// Calculate the parameter number (increases for each compound in each block)
					const paramNum = i + 1 + (compoundIndex * blockCount);
					
					const plotterSchedule = this.convertDoseScheduleToGLPPlotter(dosesPerWeek);

					// Build the parameter string for this compound and block
					const blockParams = [
						`medication${paramNum}=${compound.name.toLowerCase()}`,
						`g${paramNum}=${compound.ester.toLowerCase()}`,
						`offset_days${paramNum}=0`,
						`dose${paramNum}=${weeklyDose/dosesPerWeek}`,
						`from${paramNum}=${startWeek}`,
						`to${paramNum}=${endWeek}`,
						`frequency${paramNum}=${plotterSchedule}`,
						`compare${paramNum}=false`,
					].join('&');
					
					urlParams.push(blockParams);
				});
			}
			
			// Add the length
			urlParams.push(`length=${this.weeks}`);
			
			// Combine into final URL
			const finalUrl = baseUrl + urlParams.join('&');
			// console.log(finalUrl)
			return finalUrl;
		},
		calculateDose(compoundId, weeklyDose) {
			if (!weeklyDose) return { mg: 0, ml: 0, units: 0 }
			
			let concentration = this.compoundData[compoundId].concentration
			let dosesPerWeek = this.compoundData[compoundId].dosesPerWeek

			// if (compoundId == 'hgh'){
			// 	concentration =  this.compoundData[compoundId].concentrationiu
			// }

			let dailyMg = weeklyDose / dosesPerWeek
			let dailyMl = dailyMg / concentration
			let dailyUnits = dailyMl * 100

			dailyMg = Number.isInteger(dailyMg) ? dailyMg : Math.round(dailyMg)
			dailyMl = Number.isInteger(dailyMl) ? dailyMl : dailyMl.toFixed(2)
			dailyUnits= dailyUnits.toFixed(0)

			// console.log(this.compoundData[compoundId])
			// console.log("dailyMg: "+dailyMg)
			// console.log("dailyMl: "+dailyMl)
			// console.log("dailyUnits: "+dailyUnits)
			

			return {
				mg: isNaN(dailyMg) || !isFinite(dailyMg) ? 0 : dailyMg,
				ml: isNaN(dailyMl) || !isFinite(dailyMl) ? 0 : dailyMl,
				units: isNaN(dailyUnits) || !isFinite(dailyUnits) ? 0 : dailyUnits
			}

		},
		calculateWeeklymL(blockStart) {
			console.log('calculateWeeklymL')
			let totalBlockmL = 0

			// Calculate cost for each compound with safety checks
			this.activeCompounds.forEach(compound => {
				// Get compound info with safety check
				const compoundInfo = this.compoundData[compound.id]
				if (!compoundInfo || !compoundInfo.weeklyDoses || (!compoundInfo.concentration && compound.id !='hgh')) {
					console.log('missing info')
					return // Skip this compound if data is invalid
				}
				// Safely access weekly doses with default of 0
				const blockDose = (compoundInfo.weeklyDoses[blockStart] || 0)
				let mlPerWeek = blockDose / compoundInfo.concentration
				if (compound.id == 'hgh'){

					mlPerWeek = blockDose / compoundInfo.concentrationiu
					
				}
				
				const mlPerBlock = mlPerWeek * 4

				totalBlockmL += mlPerBlock
				
				// TODO rounding issue here

			})
			return isNaN(totalBlockmL / 4) || !isFinite(totalBlockmL / 4) ? 0 : totalBlockmL / 4;
			   
		},
		calculateVialsNeeded(compoundId) {
			let totalMl = 0
			const compoundInfo = this.compoundData[compoundId]
			
			// Add safety checks
			if (!compoundInfo || !compoundInfo.weeklyDoses || (!compoundInfo.concentration && compoundId !='hgh')) {
				console.log('safety check broke')
				return 0
			}

			this.weekBlocks.forEach(blockStart => {
				// Safely access weeklyDoses with default of 0
				let weeklyDose = (compoundInfo.weeklyDoses[blockStart] || 0)
				let mlPerWeek = weeklyDose / compoundInfo.concentration

				if( compoundId === 'hgh'){
					mlPerWeek = weeklyDose / compoundInfo.concentrationiu
				}

				totalMl += mlPerWeek * 4

			})
			if (compoundId == 'hgh'){
				if (compoundInfo.isngenla){
					return isNaN(Math.ceil(totalMl / 1.5)) || !isFinite(Math.ceil(totalMl / 1.5)) ? 0 : Math.ceil(totalMl / 1.5);
				}
				else{
					return isNaN(Math.ceil(totalMl / compoundInfo.ml)) || !isFinite(Math.ceil(totalMl / compoundInfo.ml)) ? 0 : Math.ceil(totalMl / compoundInfo.ml);
				}
			}
			return isNaN(Math.ceil(totalMl / compoundInfo.vialAmount)) || !isFinite(Math.ceil(totalMl / compoundInfo.vialAmount)) ? 0 : Math.ceil(totalMl / compoundInfo.vialAmount);
			
		},
		calculateBlockCost(blockStart) {
			let totalBlockCost = 0

			// Calculate cost for each compound with safety checks
			this.activeCompounds.forEach(compound => {
				// Get compound info with safety check
				const compoundInfo = this.compoundData[compound.id]
				if (!compoundInfo || !compoundInfo.weeklyDoses || (!compoundInfo.concentration && compound.id !='hgh')) {
					return // Skip this compound if data is invalid
				}
				// Safely access weekly doses with default of 0
				let blockDose = (compoundInfo.weeklyDoses[blockStart] || 0)
				let mlPerWeek = blockDose / compoundInfo.concentration
				if( compound.id === 'hgh'){
					
					mlPerWeek = blockDose / compoundInfo.concentrationiu
					

				}
				let mlPerBlock = mlPerWeek * 4

				let compoundCost = (mlPerBlock / compoundInfo.vialAmount) *  compoundInfo.vialCost //this.costPerVial
				
				if( compound.id === 'hgh'){
					compoundCost = (mlPerBlock / compoundInfo.ml) *  compoundInfo.vialCost //this.costPerVial
				}

				totalBlockCost += compoundCost
			})

			// Add blood work cost if scheduled
			const bloodWork = this.bloodWorkSchedule[blockStart]
			if (bloodWork === 'bbOrgan') {
				totalBlockCost += this.bloodWorkCosts.bbOrgan
			} else if (bloodWork === 'bbFollowUp') {
				totalBlockCost += this.bloodWorkCosts.bbFollowUp
			}

			return isNaN(totalBlockCost) || !isFinite(totalBlockCost) ? 0 : totalBlockCost;

		},
		calculateTotalCost() {
		return this.weekBlocks.reduce((total, blockStart) => {
			return total + this.calculateBlockCost(blockStart)
		}, 0)
		},
		copyToClipboard(text) {
			navigator.clipboard.writeText(text).then(() => {
				toast.success("Copied to Clipboard!")
			}).catch(err => {
				toast.error("Unable to Copy!")
				console.error('Failed to copy URL: ', err);
			});
		},
		// saveCycle(){
		// 	if (this.cycleName === '') {
		// 		toast.error("Please add a name!")
		// 		return
		// 	}

		// 	let saveData = {
		// 		"activeCompounds": this.activeCompounds,
		// 		"compoundData": this.compoundData,
		// 		"bloodWorkSchedule": this.bloodWorkSchedule,
		// 		"weeks": this.weeks,
		// 		"availableTypes": this.availableTypes
		// 	}
		// 	localStorage.setItem("save-"+this.cycleName, JSON.stringify(saveData))
		// 	toast.success("Saved to browser memory!")
		// 	this.cycleName = null
		// 	this.savedCycles()
		// },
		loadCycles(){
			this.$axios.get('?action=loadcycles').then(res =>{
				this.isloading = false
				if(!res.data['error']){
					// let savedJson = JSON.parse(res.data['savedCycles'])
					this.saves = res.data['savedCycles']
				}else {
					console.log(res.data['message']) 
					toast.error(res.data['message'])
				}
			})
			
		},
		saveCycle(){
			if (this.cycleName === '') {
				toast.error("Please add a name!")
				return
			}
			let saveData = {
				"activeCompounds": this.activeCompounds,
				"compoundData": this.compoundData,
				"bloodWorkSchedule": this.bloodWorkSchedule,
				"weeks": this.weeks,
				"availableTypes": this.availableTypes
			}
			const formdata = new FormData();
			formdata.append("cycleName", this.cycleName);
			formdata.append("cycleInfo", JSON.stringify(saveData));

			this.$axios.post('?action=savecycle',formdata).then(res =>{
				this.isloading = false
				if(!res.data['error']){
					console.log(res.data)				
					this.loadCycles()
					toast.success(res.data['message'])
				}else {
					console.log(res.data['message']) 
					toast.error(res.data['message'])
				}
			})
		},
		loadCycle(baseName){
			const formdata = new FormData();
			formdata.append("cycleName", baseName);
			this.$axios.post('?action=loadcycle',formdata).then(res =>{
				this.isloading = false
				if(!res.data['error']){
					let savedJson = JSON.parse(res.data['cycleInfo'])
					this.activeCompounds = savedJson.activeCompounds
					this.compoundData = savedJson.compoundData
					this.bloodWorkSchedule = savedJson.bloodWorkSchedule
					this.weeks = savedJson.weeks
					this.weeklyDoses = savedJson.weeklyDoses
					this.availableTypes = savedJson.availableTypes
				}else {
					console.log(res.data['message']) 
				}
			})
			
		},
		
		// loadCycle(baseName){
		// 	let name = "save-"+baseName
		// 	const saved = localStorage.getItem(name)
		// 	if(saved === null){
		// 		toast.error("That name does not exist!")
		// 		return
		// 	}
		// 	let savedJson = JSON.parse(saved)
		// 	this.activeCompounds = savedJson.activeCompounds
		// 	this.compoundData = savedJson.compoundData
		// 	this.bloodWorkSchedule = savedJson.bloodWorkSchedule
		// 	this.weeks = savedJson.weeks
		// 	this.weeklyDoses = savedJson.weeklyDoses
		// 	this.availableTypes = savedJson.availableTypes
		// 	this.savedCycles()
		// 	toast.success("Loaded from browser memory!")
		// },
		loadPreMadeCycle(name){
			let activeCompounds, compoundData, bloodWorkSchedule, weeks;
			if(name === 'chaseIronsYearlong'){
				console.log("load chase's yr long cycle")
				weeks = 52
				activeCompounds = [
									{
										"id": "test_cyp",
										"name": "Testosterone",
										"ester": "Cypionate",
										"category": "steroids",
										"color":"#4F46E5",
									},
									{
										"id": "primo_inj",
										"name": "Primobolan",
										"ester": "Injectable",
										"category": "steroids",
										"color":"#EA580C",
									}
								]

				compoundData = {
									"test_cyp": {
										"concentration": 200,
										"weeklyDoses": {
										"1": 250,
										"5": 250,
										"9": 300,
										"13": 300,
										"17": 350,
										"21": 350,
										"25": 400,
										"29": 400,
										"33": 400,
										"37": 400,
										"41": 400,
										"45": 450,
										"49": 450
										},
										"vialAmount": 10,
										"vialCost": 50,
										"dosesPerWeek": 7,
										"color":"#4F46E5"
									},
									"primo_inj": {
										"concentration": 100,
										"weeklyDoses": {
										"1": 0,
										"5": 0,
										"9": 0,
										"13": 0,
										"17": 0,
										"21": 0,
										"25": 0,
										"29": 0,
										"33": 100,
										"37": 200,
										"41": 300,
										"45": 350,
										"49": 400
										},
										"vialAmount": 10,
										"vialCost": 120,
										"dosesPerWeek": 7,
										"color": "#EA580C"
									}
									}

				bloodWorkSchedule = {
									"1": "none",
									"5": "bbOrgan",
									"9": "none",
									"13": "bbOrgan",
									"17": "none",
									"21": "bbOrgan",
									"25": "none",
									"29": "bbOrgan",
									"33": "bbFollowUp",
									"37": "bbFollowUp",
									"41": "none",
									"45": "bbFollowUp",
									"49": "bbOrgan"
									}
				
			}
			else if (name === 'trt-daily' || name === 'trt-weekly'){
				let freq
				if (name === 'trt-daily'){
					freq = 7
				}else{
					freq = 1
				}
				weeks = 52
				activeCompounds= [
									{
										"id": "test_cyp",
										"name": "Testosterone",
										"ester": "Cypionate",
										"category": "steroids",
										"color": "#4F46E5"
									}
								]

				compoundData= {
								"test_cyp": {
									"concentration": 250,
									"weeklyDoses": {
										"1": 180,
										"5": 180,
										"9": 180,
										"13": 180,
										"17": 180,
										"21": 180,
										"25": 180,
										"29": 180,
										"33": 180,
										"37": 180,
										"41": 180,
										"45": 180,
										"49": 180
									},
									"vialAmount": 10,
									"vialCost": 50,
									"dosesPerWeek": freq,
									"color": "#4F46E5"
								}
							}

				bloodWorkSchedule = {
										"9": "bbOrgan",
										"21": "bbFollowUp",
										"33": "bbFollowUp",
										"45": "bbOrgan"
									}
			}
			this.activeCompounds = activeCompounds
			this.compoundData = compoundData
			this.bloodWorkSchedule = bloodWorkSchedule
			this.weeks = weeks
			toast.success("Successfully Loaded!")
		},
		// deleteCycle(baseName){
		// 	let name = "save-"+baseName
		// 	const saved = localStorage.getItem(name)
		// 	if(saved === null){
		// 		toast.error("That name does not exist!")
		// 		return
		// 	}
		// 	localStorage.removeItem(name);
		// 	this.savedCycles()
		// 	toast.success("Deleted from browser memory!")
		// },
		deleteCycle(baseName){
			if (this.cycleToDelete === '') {
				toast.error("Please select which to delete!")
				return
			}
			
			const formdata = new FormData();
			formdata.append("cycleToDelete", this.cycleToDelete);

			this.$axios.post('?action=deletecycle',formdata).then(res =>{
				this.isloading = false
				if(!res.data['error']){
					console.log(res.data)	
					this.loadCycles()
					toast.success(res.data['message'])
				}else {
					console.log(res.data['message']) 
					toast.error(res.data['message'])
				}
			})
		},
		calculatehgh(){
			
			// console.log('calculatehgh')
			
			let concentrationmg = this.compoundData['hgh'].mg / this.compoundData['hgh'].ml
			
			let concentrationiu = (this.compoundData['hgh'].mg * 3) / this.compoundData['hgh'].ml

			let pentotaliu = concentrationiu * this.compoundData['hgh'].ml
			let pentotalmg = concentrationmg * this.compoundData['hgh'].ml

			if (this.compoundData['hgh'].isngenla){
				pentotaliu = concentrationiu * 1.5 //account for the extra 0.3ml in the syringe
				pentotalmg = concentrationmg * 1.5 
			}

			this.compoundData['hgh'].concentration = concentrationmg; 
			this.compoundData['hgh'].concentrationiu = concentrationiu; 

			this.compoundData['hgh'].pentotaliu = pentotaliu;
			this.compoundData['hgh'].pentotalmg = pentotalmg;
			
			// console.log(this.activeCompounds)
		},
		previousWeek(blockStart, compoundId) {
			
			return this.compoundData[compoundId].weeklyDoses[blockStart-4] || 0
		},
		copyDose(blockStart, compoundId){
			this.compoundData[compoundId].weeklyDoses[blockStart] = this.compoundData[compoundId].weeklyDoses[blockStart-4]
		}
	},
	mounted() {
		// this.savedCycles()
		// this.loadCycles()
	}
}
</script>