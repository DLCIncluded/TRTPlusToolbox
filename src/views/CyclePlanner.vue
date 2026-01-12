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
							<select name="cycle" v-model="cycle.weeks">
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
						<input class="input" type="number" placeholder="ex: 299" v-model="cycle.bloodWorkCosts.bbOrgan">
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
						<input class="input" type="number" placeholder="ex: 159" v-model="cycle.bloodWorkCosts.bbFollowUp">
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
							<select name="bloodworkday" v-model="cycle.bloodWorkPreferredDay">
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
							<select name="bloodworkweek" v-model="cycle.bloodWorkPreferredWeek">
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
			<a :class="saveLoadTab === 'load' ? 'is-active has-text-white' : 'has-text-primary-light'" @click.prevent="saveLoadTab = 'load'" v-if="cycles">
				Load
			</a>
		</p>
		<div class="panel-block" v-show="saveLoadTab === 'new' || (saveLoadTab !== 'load' && !selectedCycleId)">
			<div>
				<p class="">Create a new cycle from scratch.</p>
				<p class="">This will allow you to plan your cycle with the settings you have configured.</p>
				<div class="grid">
					<div class="field cell">
						<label class="label">Name</label>
						<div class="control">
							<input class="input" type="text" placeholder="ex: TRT" v-model="newCycleName">
						</div>
					</div>
				</div>
				<div class="buttons is-centered">
					<button class="button is-success" @click="createNew">Create</button>
					<button class="button is-error" @click="saveLoadTab='';newCycleName=''">Cancel</button>
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
								<select v-model="selectedCycleId" @change="onCycleSelect">
									<option value="" disabled selected>Select a cycle</option>
									<option v-for="cycle in cycles" :key="cycle.id" :value="cycle.id">{{ cycle.title }}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="buttons is-centered">
					<button class="button is-success" @click="onCycleSelect" :disabled="!selectedCycleId">Load</button>
					<button class="button is-error" @click="saveLoadTab=''">Cancel</button>
				</div> -->

			</div>
		</div>
	</article>

	<div>
		<h1 class="title has-text-centered">{{ cycle.title || 'New Cycle' }}</h1>
	</div>

	<article class="panel is-primary" v-if="selectedCycleId || cycle.title">
		<p class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			<span>Cycle Start Date</span>
		</p>
		<div class="column is-one-quarter-desktop is-full-mobile">
			<div class="control ">
				<input 
					type="date" 
					class="input no-spinner"
					min="0"
					v-model="cycle.startDate"
				>

			</div>
		</div>

	</article>

	<article class="panel is-primary" v-if="selectedCycleId || cycle.title">
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

				<div v-for="compound in cycle.activeCompounds" :key="compound.id" class="cell box ">
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
										v-model="cycle.compoundData[compound.id].concentration" 
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
										v-model="cycle.compoundData[compound.id].vialAmount" 
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
											v-model="cycle.compoundData[compound.id].vialCost" 
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
									v-model="cycle.compoundData[compound.id].dosesPerWeek"
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
							<div class="column is-half-desktop is-full-mobile" v-if="cycle.compoundData[compound.id].dosesPerWeek == 1">
								<label class="label">Day For Injection</label>
								<select 
									v-model="cycle.compoundData[compound.id].injectionDay"
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

	
	<article class="panel is-primary" v-for="blockStart in weekBlocks" :key="blockStart" v-if="selectedCycleId || cycle.title">
		<p class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			<span>Weeks {{ blockStart }}-{{ blockStart + 3 }}</span>
		</p>
		<p class="pt-4 pl-4">
			Weekly doses for each compound in this block. <br>
		</p>
		<div class="panel-block fixed-grid has-1-cols-mobile has-5-cols-desktop">
			<div class="grid">
				<div class="cell" v-for="compound in cycle.activeCompounds" :key="compound.id">
					<label class="label">{{ compound.name }} {{ compound.esterShort }}</label>
					<div class="field has-addons">
						<div class="control has-icons-left has-icons-right has-addons">
							<input class="input no-spinner" type="number" placeholder=""
								v-model="cycle.compoundData[compound.id].weeklyDoses[blockStart]" 
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
								<p class="mb-1 pl-2">{{ calculateDose(compound.id,cycle.compoundData[compound.id].weeklyDoses[blockStart]).mg }} <span v-if="compound.id != 'hgh'">mg</span><span v-else>iu</span></p>
								<p class="mb-1 pl-2">{{ calculateDose(compound.id,cycle.compoundData[compound.id].weeklyDoses[blockStart]).ml }} ml</p>
								<p class="mb-1 pl-2">{{ calculateDose(compound.id,cycle.compoundData[compound.id].weeklyDoses[blockStart]).units }} units</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="panel-block">
			<div class="field" style="width:100%">
				<label class="label">Blood Work Type</label>
				<div class="control">
					<div class="select is-fullwidth">
						<select v-model="cycle.bloodWorkSchedule[blockStart]" @change="calculateTotalCost" style="width:100%">
							<option value="none">None</option>
							<option value="bbOrgan">Full Panel</option>
							<option value="bbFollowUp">Follow Up Panel</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		<div class="panel-block " style="width:100%">
			<div class="columns is-multiline is-variable is-fullwidth py-3" style="width:100%">
				<div class="column is-one-sixth is-flex-mobile is-justify-content-space-between-mobile is-align-items-center-mobile py-1">
					<p class="font-medium mr-1 my-0">Weekly Total(mL):</p>
					<p class="pb-0">{{ calculateWeeklymL(blockStart).toFixed(2) }} ml</p>
				</div>
				<div class="column is-one-sixth is-flex-mobile is-justify-content-space-between-mobile is-align-items-center-mobile py-1">
					<p class="font-medium mr-1 my-0">Block Total(mL):</p>
					<p class="pb-0">{{ (calculateWeeklymL(blockStart) * 4).toFixed(2) }} ml</p>
				</div>
				<div class="column is-one-sixth is-flex-mobile is-justify-content-space-between-mobile is-align-items-center-mobile py-1">
					<p class="font-medium mr-1 my-0">Avg $/wk:</p>
					<p class="pb-0">${{ (calculateBlockCost(blockStart, false) / 4).toFixed(2) }}</p>
				</div>
				<div class="column is-one-sixth is-flex-mobile is-justify-content-space-between-mobile is-align-items-center-mobile py-1">
					<p class="font-medium mr-1 my-0">Cost W/O Bloodwork:</p>
					<p class="pb-0">${{ (calculateBlockCost(blockStart, false)).toFixed(2) }}</p>
				</div>
				<div class="column is-one-sixth is-flex-mobile is-justify-content-space-between-mobile is-align-items-center-mobile py-1">
					<p class="font-medium mr-1 my-0">Weekly Avg:</p>
					<p class="pb-0">${{ (calculateBlockCost(blockStart)/4).toFixed(2) }}</p>
				</div>
				<div class="column is-one-sixth is-flex-mobile is-justify-content-space-between-mobile is-align-items-center-mobile py-1">
					<p class="font-medium mr-1 my-0">Total Cost:</p>
					<p class="pb-0">${{ calculateBlockCost(blockStart).toFixed(2) }}</p>
				</div>
			</div>
		</div>
	</article>

	<article class="panel is-primary">
		<p class="panel-heading">Save Cycle</p>
		<div class="panel-block">
			<button @click="saveCycle" class="button is-primary">Save</button>
		</div>
	</article>

	<article class="panel is-primary" v-if="selectedCycleId || cycle.title">
		<p class="panel-heading">Summary</p>
		<div class="panel-block">
				<div class="container is-fluid w-full">
					<div class="columns is-4">
						<div class="column">
							<p><strong>Cycle Length:</strong></p>
							<p>{{ cycle.weeks }} weeks</p>
						</div>

						<div class="column">
							<p class="">Total Cost:</p>
							<p>${{ calculateTotalCost().toFixed(2) }}</p>
						</div>
						<div class="column">
							<p class="">Average Cost per Week:</p>
							<p>${{ (calculateTotalCost() / cycle.weeks).toFixed(2) }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="panel-block ">
				<div class="container is-fluid w-full">
					<div class="columns is-4">
						<div v-for="compound in cycle.activeCompounds" :key="compound.id" class="column">
							<div class="box has-background-black-ter">
								<p class="label">{{ compound.name }} {{ compound.esterShort }}</p>
								<p v-if="compound.id != 'hgh'" class="font-medium dark:text-white">Vials Needed:</p>
								<p v-else class="font-medium dark:text-white">Vials/Pens Needed:</p>
								<p v-if="compound.id !='hgh'">{{ calculateVialsNeeded(compound.id) }} ({{ cycle.compoundData[compound.id].vialAmount }}ml vial) <TooltipIcon :has-item="checkIfInInventory(compound.id, calculateMlNeeded(compound.id))" /></p>
								<p v-else>{{ calculateVialsNeeded(compound.id) }} (vials/pens) <TooltipIcon :has-item="checkIfInInventory(compound.id, calculateMlNeeded(compound.id))" /></p>
								<!-- <p>{{ checkIfInInventory(compound.id, calculateMlNeeded(compound.id)) }}</p> -->
							</div>
						</div>
					</div>
				</div>	
				
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
		<div class="panel-block">
			<div class="container is-fluid w-full">
				<div class="columns is-4">
					<div v-if="hasCompounds" class="column">
						<RouterLink to="/cyclecalendar" class="button">View Calendar</RouterLink>
					</div>
					<div v-if="hasCompounds" class="column">
						<button class="button" @click="generateOrder">Generate Order</button>
					</div>
				</div>
			</div>	
			

			
		</div>


	</article>

	

	<article class="panel is-primary" v-if="currentEnv == 'development'">
		<p class="panel-heading">Debugging</p>
		<div class="panel-block">
			<!-- <div class="field">
				<button @click="testAPI" class="button is-info">Test API Connection</button>
			</div> -->
			<pre>{{ cycle }}</pre>
		</div>
	</article>

	<div class="modal" :class="{ 'is-active': showOrderModal }" v-if="showOrderModal">
		<div class="modal-background" @click="showOrderModal = false;"></div>
		<div class="modal-card">
			<header class="modal-card-head">
			<p class="modal-card-title">Need To Order</p>
			<button class="delete" aria-label="close" @click="showOrderModal = false;"></button>
			</header>
			<section class="modal-card-body">
				<div class="content">
					<p v-for="item in orderItems" :key="item.id">{{ item.name }} x{{ item.countToOrder }} - ${{ item.cost }}</p>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
import availableTypes from '@/assets/availableTypes.json'
import MUI from '@/components/icons/MUI.vue'
import { useAuthStore } from '@/stores/auth'
import { useCycleStore } from '@/stores/cycle'
import { useToast } from "vue-toastification";
const toast = useToast();
import TooltipIcon from '@/components/TooltipIcon.vue'
const currentEnv = import.meta.env.VITE_ENV || 'development';

export default {
	name: 'CyclePlanner',
	components: {
		MUI,
		TooltipIcon
	},
	data() {
		return {
			
			...availableTypes,
			authStore: useAuthStore(),
			cycleStore: useCycleStore(),
			newCycleName: '',
			cycle: {
				id: null,
				title: '',
				weeks: 16,
				bloodWorkCosts: {
					bbOrgan: 299,
					bbFollowUp: 159
				},
				bloodWorkSchedule: {},
				bloodWorkPreferredDay: 1,
				bloodWorkPreferredWeek: 4,
				activeCompounds: [],
				compoundData: {}
			},
			currentEnv,
			selectedCycleId: null,
			selectedCycleName: '',
			cycles: [],
			isLoadingCycles: false,
			explicitLoad: false,
			saveLoadTab: 'main',
			showSettings: false,
			inventoryItems: [],
			selectedCompound: null,
			showDoseDetails: {},
			cycleToLoad: '',
			showOrderModal: false,
			orderItems: [],
		}
	},
	computed: {
		hasCompounds() {
			return this.cycle.activeCompounds.length > 0
		},
		showPlotterUrl(){
			if (this.cycle.activeCompounds.length===1){
				if (this.cycle.activeCompounds.some(compound => compound.id === 'hgh')) return false;
			}
			return this.cycle.activeCompounds.length > 0
		},
		hasGLP1() {
			// show only peptides - excluding HGH
			return this.cycle.activeCompounds.some(compound => compound.category === 'peptides-glp')
		},
		plotterUrl() {
			return this.generatePlotterUrl();
		},
		plotterGLPUrl() {
			return this.generateGLPPlotterUrl();
		},
		weekBlocks() {
			const blocks = []
			for (let i = 1; i <= this.cycle.weeks; i += 4) {
				blocks.push(i)
			}
			return blocks
		},
		availableToAdd() {
			return this.availableTypes.filter(type => 
				!this.cycle.activeCompounds.find(compound => compound.id === type.id)
			)
		},
		
	},
	watch: {
		selectedCycleId(newValue) {
			if (newValue) {
				this.loadCycle(newValue)
			} else {
				// Reset to new cycle
				this.resetCycle()
			}
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
		generateOrder() {
			this.orderItems = []
			this.cycle.activeCompounds.forEach(compound => {
				const mlNeeded = this.calculateMlNeeded(compound.id)
				if (mlNeeded > 0) {
					
					// Use the same mapping logic as checkIfInInventory
					const getInventoryMatch = (cycleCompoundId) => {
						const mappings = {
							'test_cyp': { name: 'Testosterone', ester: 'Cypionate' },
							'test_enan': { name: 'Testosterone', ester: 'Enanthate' },
							'test_prop': { name: 'Testosterone', ester: 'Propionate' },
							'mast_prop': { name: 'Masteron', ester: 'Propionate' },
							'mast_enan': { name: 'Masteron', ester: 'Enanthate' },
							'tren_ace': { name: 'Trenbolone', ester: 'Acetate' },
							'tren_enan': { name: 'Trenbolone', ester: 'Enanthate' },
							'npp': { name: 'Nandrolone', ester: 'Phenylpropionate' },
							'deca': { name: 'Nandrolone', ester: 'Decanoate' },
							'primo_inj': { name: 'Primobolan', ester: 'Enanthate' },
							'eq': { name: 'Boldenone', ester: 'Undecylenate' },
							'hgh': { name: 'HGH', ester: null },
							'hcg': { name: 'HCG', ester: null },
							'bpc157': { name: 'BPC-157', ester: null },
							'tb500': { name: 'TB-500', ester: null },
							'semaglutide': { name: 'Semaglutide', ester: null },
							'tirzepatide': { name: 'Tirzepatide', ester: null },
							'arimidex': { name: 'Anastrozole', ester: null },
							'aromasin': { name: 'Exemestane', ester: null },
							'nolvadex': { name: 'Tamoxifen', ester: null },
							'clomid': { name: 'Clomiphene', ester: null }
						};
						return mappings[cycleCompoundId];
					};
					
					const match = getInventoryMatch(compound.id);
					let totalMl = 0;
					if (match) {
						// Find ALL matching inventory items and sum them up
						const matchingItems = this.inventoryItems.filter(item => {
							if (match.ester) {
								return item.name === match.name && item.ester === match.ester;
							} else {
								return item.name === match.name;
							}
						});
						
						// Sum up total ML from all matching records
						totalMl = matchingItems.reduce((sum, item) => {
							return sum + (item.container_size * item.container_count);
						}, 0);

					}
					
					let vialsNeeded = this.calculateVialsNeeded(compound.id)

					let inInventory = false
					let enoughVials = false

					if (totalMl > 0) {
						inInventory = totalMl >= mlNeeded
						enoughVials = Math.floor(totalMl / (compound.id === 'hgh' ? this.cycle.compoundData[compound.id].ml : this.cycle.compoundData[compound.id].vialAmount)) >= vialsNeeded
					}

					
					
					vialsNeeded = (mlNeeded / 10) - (totalMl / 10) // assuming 10ml vials for calculation
					vialsNeeded = Math.ceil(vialsNeeded)

					console.log("Compound:", compound.id, "ML Needed:", mlNeeded, "Total ML in Inventory:", totalMl, "Vials Needed after inventory:", vialsNeeded, "In Inventory:", inInventory, "Enough Vials:", enoughVials);
					
					const cost = vialsNeeded * (this.cycle.compoundData[compound.id]?.vialCost || 0)

					if (!inInventory || !enoughVials) {
						

						this.orderItems.push({
							id: compound.id,
							name: compound.name + ' ' + compound.esterShort,
							countToOrder: vialsNeeded,
							cost: cost.toFixed(2)
						})
					}
				}
			})

			this.showOrderModal = true

		},
		async fetchInventoryItems() {
			if (!this.authStore.isAuthenticated) {
				console.log('User not authenticated, skipping inventory fetch')
				this.inventoryItems = []
				return
			}
			
			try {
				const response = await this.$axios.get('/api/inventory')
				
				if (response.data && response.data.inventory) {
					console.log('Loaded inventory items:', response.data.inventory.length)
					this.inventoryItems = response.data.inventory
				} else {
					console.log('No inventory items found')
					this.inventoryItems = []
				}
			} catch (error) {
				console.error('Error fetching inventory:', error)
				this.inventoryItems = []
				toast.error('Failed to load inventory items')
			}
		},
		checkIfInInventory(compoundId, mlNeeded) {
			console.log("Checking inventory for compoundId:", compoundId, "mlNeeded:", mlNeeded);
			
			// Create a mapping function from cycle compound IDs to inventory names/esters
			const getInventoryMatch = (cycleCompoundId) => {
				const mappings = {
					'test_cyp': { name: 'Testosterone', ester: 'Cypionate' },
					'test_enan': { name: 'Testosterone', ester: 'Enanthate' },
					'test_prop': { name: 'Testosterone', ester: 'Propionate' },
					'mast_prop': { name: 'Masteron', ester: 'Propionate' },
					'mast_enan': { name: 'Masteron', ester: 'Enanthate' },
					'tren_ace': { name: 'Trenbolone', ester: 'Acetate' },
					'tren_enan': { name: 'Trenbolone', ester: 'Enanthate' },
					'npp': { name: 'Nandrolone', ester: 'Phenylpropionate' },
					'deca': { name: 'Nandrolone', ester: 'Decanoate' },
					'primo_inj': { name: 'Primobolan', ester: 'Enanthate' },
					'eq': { name: 'Boldenone', ester: 'Undecylenate' },
					'hgh': { name: 'HGH', ester: null },
					'hcg': { name: 'HCG', ester: null },
					'bpc157': { name: 'BPC-157', ester: null },
					'tb500': { name: 'TB-500', ester: null },
					'semaglutide': { name: 'Semaglutide', ester: null },
					'tirzepatide': { name: 'Tirzepatide', ester: null },
					'arimidex': { name: 'Anastrozole', ester: null },
					'aromasin': { name: 'Exemestane', ester: null },
					'nolvadex': { name: 'Tamoxifen', ester: null },
					'clomid': { name: 'Clomiphene', ester: null }
				};
				return mappings[cycleCompoundId];
			};
			
			const match = getInventoryMatch(compoundId);
			if (!match) {
				console.log("No inventory mapping found for compound:", compoundId);
				return false;
			}
			
			// Find ALL inventory items that match name and ester, then sum them up
			const matchingItems = this.inventoryItems.filter(item => {
				if (match.ester) {
					return item.name === match.name && item.ester === match.ester;
				} else {
					return item.name === match.name;
				}
			});
			
			if (matchingItems.length > 0) {
				console.log(`Found ${matchingItems.length} inventory records for:`, match);
				
				// Sum up total ML from all matching records
				const totalMl = matchingItems.reduce((sum, item) => {
					const itemMl = item.container_size * item.container_count;
					console.log(`  Record: ${itemMl}ml (${item.container_count} x ${item.container_size}ml containers)`);
					return sum + itemMl;
				}, 0);
				
				console.log("Total ML available from all records:", totalMl, "needed:", mlNeeded);
				return totalMl >= mlNeeded;
			}
			
			console.log("No inventory items found for:", match);
			return false;
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
		async createNew() {
			if (this.newCycleName.trim() === '') {
				toast.error("Please enter a cycle name")
				return
			}
			
			// Create the initial cycle data
			const initialCycleData = {
				title: this.newCycleName.trim(),
				weeks: 16,
				bloodWorkCosts: {
					bbOrgan: 299,
					bbFollowUp: 159
				},
				bloodWorkSchedule: {},
				bloodWorkPreferredDay: 1,
				bloodWorkPreferredWeek: 4,
				activeCompounds: [],
				compoundData: {}
			}
			
			try {
				// Create the cycle in the database
				const result = await this.cycleStore.createCycle({
					title: this.newCycleName.trim(),
					data: initialCycleData
				})
				console.log('Result:', result)
				
				if (result.success) {
					
					
					// Set the cycle data locally (don't change `selectedCycleId` to avoid triggering auto-load)
					this.cycle = { ...result.cycle.data, id: result.cycle.id, title: result.cycle.title }
					this.selectedCycleName = result.cycle.title
					
					// Save the new cycle ID to localStorage (for later auto-load)
					localStorage.setItem('lastSelectedCycleId', result.cycle.id)
					
					// Clear the new cycle name and switch tabs
					this.newCycleName = ''
					this.saveLoadTab = ''
					
					// Reload the cycles list
					// await this.loadCycles()
					
					toast.success("New Cycle Created! You can now add compounds to your cycle.")
				}
			} catch (error) {
				console.error('Error creating cycle:', error)
				toast.error("Failed to create cycle")
			}
		},
		resetAllValues() {
			// TODO: Reset all values to defaults
			this.cycle = {
				weeks: 16,
				bloodWorkCosts: {
					bbOrgan: 299,
					bbFollowUp: 159
				},
				bloodWorkSchedule: {},
				bloodWorkPreferredDay: 1,
				bloodWorkPreferredWeek: 4,
				activeCompounds: [],
				compoundData: {}
			}
			toast.success("Everything Reset!")
		},
		// New methods for cycle management with new auth system
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
						cycle: cycle.data
					}))
					console.log('Loaded cycles:', this.cycles)
				} else {
					console.log('No cycles returned from store')
					this.cycles = []
				}
			} catch (error) {
				console.error('Error loading cycles:', error)
				throw error
			}
		},
		async loadLastSelectedCycle() {
			// Get the last selected cycle ID from localStorage
			const lastCycleId = localStorage.getItem('lastSelectedCycleId')
			
			if (!lastCycleId) {
				console.log('No last selected cycle found in localStorage')
				return
			}

			console.log('Auto-loading last selected cycle ID:', lastCycleId)
			const savedResult = await this.cycleStore.loadCycle(lastCycleId)

			if (!savedResult || !savedResult.cycle) {
				console.log(`Cycle with ID ${lastCycleId} not found`) 
				return
			}

			console.log('Auto-loaded cycle data (store result):', savedResult)

			const fetched = savedResult.cycle

			// Map the API cycle `data` into the component's expected shape
			if (fetched.data) {
				this.cycle = { ...fetched.data, id: fetched.id, title: fetched.title }
			} else {
				// Fallback if API returned a different shape
				this.cycle = { ...fetched, id: fetched.id, title: fetched.title }
			}

			this.selectedCycleId = fetched.id
			this.selectedCycleName = fetched.title
			console.log('Cycle after auto-load:', this.cycle)
			// toast.success(`Auto-loaded cycle: ${this.cycle.title}`)

		},
		async saveCycle() {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to save cycles')
				return
			}
			
			if (!this.cycle.name || this.cycle.name.trim() === '') {
				toast.error('Please enter a cycle name')
				return
			}
			
			try {
				// Check if this is an update to existing cycle
				const existingCycle = this.cycles.find(c => c.cycle_name === this.cycle.name)

				this.cycle.name = this.cycle_name.trim()
				
				const cycleData = {
					title: this.cycle.name,
					data: this.cycle
				}
				
				if (existingCycle) {
					// Update existing cycle
					await this.cycleStore.updateCycle(existingCycle.id, cycleData)
				} else {
					// Create new cycle
					await this.cycleStore.createCycle(cycleData)
				}
				
				// Reload cycles to update the list
				await this.loadCycles()
				
			} catch (error) {
				console.error('Error saving cycle:', error)
				toast.error('Failed to save cycle')
			}
		},
		async loadCycle(cycleId) {
			if (!cycleId) {
				return
			}
			
			try {
				// First try to find in loaded cycles
				let cycleData = this.cycles.find(c => c.id === parseInt(cycleId))
				
				if (!cycleData) {
					// If not found, fetch from API
					const response = await this.$axios.get(`/api/cycles/${cycleId}`)
					if (response.data && response.data.cycle) {
						cycleData = response.data.cycle
					}
				}
				
				if (cycleData) {
					// Load the cycle data
					this.cycle = { ...cycleData.data, id: cycleData.id, title: cycleData.title }
					this.selectedCycleName = cycleData.title
					// toast.success('Cycle loaded successfully!')
					this.saveLoadTab = ''
				} else {
					// Only show error if this was an explicit load attempt
					if (this.explicitLoad) {
						toast.error('Cycle not found')
					}
					console.warn(`Cycle ${cycleId} not found`)
				}
			} catch (error) {
				console.error('Error loading cycle:', error)
				if (this.explicitLoad) {
					toast.error('Failed to load cycle')
				}
			}
		},
		async deleteCycle() {
			if (!this.cycleToDelete || this.cycleToDelete === '') {
				toast.error("Please select which cycle to delete!")
				return
			}
			
			try {
				const cycleData = this.cycles.find(c => c.cycle_name === this.cycleToDelete)
				if (cycleData) {
					await this.cycleStore.deleteCycle(cycleData.id)
					
					// Clear localStorage if the deleted cycle was the last selected one
					const lastCycleId = localStorage.getItem('lastSelectedCycleId')
					if (lastCycleId && parseInt(lastCycleId) === cycleData.id) {
						localStorage.removeItem('lastSelectedCycleId')
					}
					
					await this.loadCycles()
					this.cycleToDelete = ''
				} else {
					toast.error('Cycle not found')
				}
			} catch (error) {
				console.error('Error deleting cycle:', error)
				toast.error('Failed to delete cycle')
			}
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
			this.cycle.activeCompounds.push({
				id: typeInfo.id,
				name: typeInfo.name,
				ester: typeInfo.ester,
				esterShort: typeInfo.esterShort,
				category: typeInfo.category,
				color: typeInfo.color,
			})

			// Initialize compound data with proper structure
			
			this.cycle.compoundData[typeInfo.id] = {
				concentration: typeInfo.defaultConcentration,
				weeklyDoses: {},
				vialAmount: typeInfo.defaultVialAmount,
				vialCost: typeInfo.defaultVialCost,
				dosesPerWeek:7,
				color: typeInfo.color,
			}

			if (typeInfo.id == 'hgh'){
				this.cycle.compoundData[typeInfo.id].mg = typeInfo.mg
				this.cycle.compoundData[typeInfo.id].ml = typeInfo.ml
				this.cycle.compoundData[typeInfo.id].isngenla = typeInfo.isngenla
				this.cycle.compoundData[typeInfo.id].concentrationmg = typeInfo.concentrationmg
				this.cycle.compoundData[typeInfo.id].concentrationiu = typeInfo.concentrationiu
				this.cycle.compoundData[typeInfo.id].pentotaliu = typeInfo.pentotaliu
				this.cycle.compoundData[typeInfo.id].pentotalmg = typeInfo.pentotalmg
			}

			//TODO come back to this, I think it is not needed anymore
			// Pre-initialize weekly doses for all blocks to 0
			// this.cycle.weekBlocks.forEach(blockStart => {
			// 	this.cycle.compoundData[typeInfo.id].weeklyDoses[blockStart] = 0
			// })
			this.selectedCompound = null
			toast.success(typeInfo.name+" Added!")
		},
		removeCompound(compoundId) {
			const index = this.cycle.activeCompounds.findIndex(c => c.id === compoundId)
			if (index !== -1) {
				let compoundName = this.cycle.activeCompounds[index].name

				this.cycle.activeCompounds.splice(index, 1)

				toast.success(compoundName+" Removed!")
				delete this.cycle.compoundData[compoundId]
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
				this.cycle.activeCompounds.filter(compound => compound.category === "peptides-glp" || compound.category === "steroids").forEach((compound, compoundIndex) => {
					// Get the weekly dose for this block and compound
					const weeklyDose = this.cycle.compoundData[compound.id]?.weeklyDoses[startWeek] || 0;

					const dosesPerWeek = this.cycle.compoundData[compound.id].dosesPerWeek;

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
					const weeklyDose = this.cycle.compoundData[compound.id]?.weeklyDoses[startWeek] || 0;

					const dosesPerWeek = this.cycle.compoundData[compound.id].dosesPerWeek;
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

			let concentration = this.cycle.compoundData[compoundId].concentration
			let dosesPerWeek = this.cycle.compoundData[compoundId].dosesPerWeek

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
			// console.log('calculateWeeklymL')
			let totalBlockmL = 0

			// Calculate cost for each compound with safety checks
			this.cycle.activeCompounds.forEach(compound => {
				// Get compound info with safety check
				const compoundInfo = this.cycle.compoundData[compound.id]
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
			const compoundInfo = this.cycle.compoundData[compoundId]
			
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
		calculateMlNeeded(compoundId) {
			let totalMl = 0
			const compoundInfo = this.cycle.compoundData[compoundId]

			// Safety check
			if (!compoundInfo || !compoundInfo.weeklyDoses || (!compoundInfo.concentration && compoundId !== 'hgh')) {
				console.log('safety check broke')
				return 0
			}

			this.weekBlocks.forEach(blockStart => {
				const weeklyDose = compoundInfo.weeklyDoses[blockStart] || 0
				let mlPerWeek = 0

				if (compoundId === 'hgh') {
					mlPerWeek = weeklyDose / compoundInfo.concentrationiu
				} else {
					mlPerWeek = weeklyDose / compoundInfo.concentration
				}

				totalMl += mlPerWeek * 4
			})

			return totalMl
		},
		calculateBlockCost(blockStart, withBloodWork = true) {
			let totalBlockCost = 0

			// Calculate cost for each compound with safety checks
			this.cycle.activeCompounds.forEach(compound => {
				// Get compound info with safety check
				const compoundInfo = this.cycle.compoundData[compound.id]
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

			if (withBloodWork) {
				// Add blood work cost if scheduled
				const bloodWork = this.cycle.bloodWorkSchedule[blockStart]
				if (bloodWork === 'bbOrgan') {
					totalBlockCost += this.cycle.bloodWorkCosts.bbOrgan
				} else if (bloodWork === 'bbFollowUp') {
					totalBlockCost += this.cycle.bloodWorkCosts.bbFollowUp
				}
			}
			// Add blood work cost if scheduled
			// const bloodWork = this.cycle.bloodWorkSchedule[blockStart]
			// if (bloodWork === 'bbOrgan') {
			// 	totalBlockCost += this.cycle.bloodWorkCosts.bbOrgan
			// } else if (bloodWork === 'bbFollowUp') {
			// 	totalBlockCost += this.cycle.bloodWorkCosts.bbFollowUp
			// }

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
		testAPI() {
			console.log('Testing API endpoints...')
			
			// Test ping (no auth required)
			this.$axios.get('/api/cycles/ping').then(res => {
				console.log('✅ Ping successful:', res.data)
				toast.success('API connection working')
				
				// Test auth endpoint
				return this.$axios.get('/api/cycles/test')
			}).then(res => {
				console.log('✅ Auth test successful:', res.data)
				toast.success('JWT authentication working')
			}).catch(error => {
				console.error('❌ API test failed:', error)
				console.error('Error response:', error.response?.data)
				toast.error(`API test failed: ${error.response?.status}`)
			})
		},
		loadCycles(){
			this.isLoadingCycles = true
			// Use the new API endpoint for getting cycles
			this.$axios.get('/api/cycles').then(res =>{
				this.isLoadingCycles = false
				if(res.data && res.data.cycles && Array.isArray(res.data.cycles)){
					// Flask API returns cycles in a wrapper object
					this.cycles = res.data.cycles
					console.log('Loaded cycles:', this.cycles)
					// Only show success toast if there are cycles or user explicitly requested reload
					if (res.data.count > 0 || this.explicitLoad) {
						// toast.success(`Loaded ${res.data.count} cycles`)
						console.log('Loaded cycles:', this.cycles)
					}
					this.explicitLoad = false
				} else {
					console.log('No cycles found or invalid response:', res.data)
					this.cycles = []
				}
			}).catch(error => {
				this.isLoadingCycles = false
				this.explicitLoad = false
				console.error('Error loading cycles:', error)
				console.error('Error response:', error.response?.data)
				console.error('Error status:', error.response?.status)
				
				if(error.response && error.response.data) {
					if(error.response.data.error) {
						toast.error(`API Error: ${error.response.data.error}`)
					} else if(error.response.data.msg) {
						// JWT errors often use 'msg' field
						toast.error(`JWT Error: ${error.response.data.msg}`)
					} else {
						toast.error(`HTTP ${error.response.status}: ${error.response.statusText}`)
					}
				} else {
					toast.error('Failed to load cycles - Network error')
				}
			})
			
		},
		saveCycle(){
			if (this.newCycleName === '' && !this.cycle.title) {
				toast.error("Please add a name!")
				return
			}

			// Determine cycle name and update cycle object
			const cycle_name = this.newCycleName !== '' ? this.newCycleName : this.cycle.title
			this.cycle.title = cycle_name

			// Prepare payload for new Flask API
			const payload = {
				"title": cycle_name,
				"data": this.cycle
			}

			this.isloading = true
			// Determine if this is an update or create
			if (this.cycle.id) {
				// Update existing cycle
				this.$axios.put(`/api/cycles/${this.cycle.id}`, payload).then(res => {
					this.handleSaveSuccess(res, 'Cycle updated successfully!')
				}).catch(error => {
					this.handleSaveError(error)
				})
			} else {
				// Create new cycle
				this.$axios.post('/api/cycles', payload).then(res => {
					if(res.data && res.data.cycle) {
						// Update local cycle with returned data including ID
						this.cycle.id = res.data.cycle.id
						this.selectedCycleId = res.data.cycle.id
						this.selectedCycleName = res.data.cycle.title
					}
					this.handleSaveSuccess(res, 'Cycle saved successfully!')
				}).catch(error => {
					this.handleSaveError(error)
				})
			}
		},
		handleSaveSuccess(res, defaultMessage) {
			this.isloading = false
			if(res.data && (res.data.cycle || res.data.message)) {
				console.log('Cycle saved successfully:', res.data)
				this.explicitLoad = true
				this.loadCycles()
				toast.success(res.data.message || defaultMessage)
				
				// Clear the new cycle name after successful save
				this.newCycleName = ''
			} else {
				console.log('Unexpected response format:', res.data)
				toast.error('Save successful but unexpected response format')
			}
		},
		handleSaveError(error) {
			this.isloading = false
			console.error('Error saving cycle:', error)
			if(error.response && error.response.data && error.response.data.error) {
				toast.error(error.response.data.error)
			} else {
				toast.error('Failed to save cycle')
			}
		},
		// Old loadCycle method - replaced with new auth system method above
		// loadCycle(){
		// 	console.log("loadCycle: "+this.selectedCycle)
		// 	... (old Discord auth implementation removed)
		// },
		
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
			
			return this.cycle.compoundData[compoundId].weeklyDoses[blockStart-4] || 0
		},
		copyDose(blockStart, compoundId){
			this.cycle.compoundData[compoundId].weeklyDoses[blockStart] = this.cycle.compoundData[compoundId].weeklyDoses[blockStart-4]
		},
		onCycleSelect() {
			if (this.selectedCycleId) {
				this.explicitLoad = true
				this.loadCycle(this.selectedCycleId)
				// Save the selected cycle ID to localStorage
				localStorage.setItem('lastSelectedCycleId', this.selectedCycleId)
			}
		},
		resetCycle() {
			this.cycle = {
				id: null,
				title: '',
				weeks: 16,
				bloodWorkCosts: {
					bbOrgan: 299,
					bbFollowUp: 159
				},
				bloodWorkSchedule: {},
				bloodWorkPreferredDay: 1,
				bloodWorkPreferredWeek: 4,
				activeCompounds: [],
				compoundData: {}
			}
			this.selectedCycleName = ''
		},
		initCycle(){
			console.log('initCycle')
			console.log('selectedCycleId:', this.selectedCycleId)
			console.log('cycle:', this.cycle)
			// Don't auto-load on init to avoid "cycle not found" errors
			// User must explicitly select a cycle
		}
	},
	async mounted() {
		// Initialize with new auth system
		console.log('Auth status:', {
			isAuthenticated: this.authStore.isAuthenticated,
			hasToken: !!localStorage.getItem('auth_token'),
			user: this.authStore.user
		})

		await this.loadLastSelectedCycle()
		
		// Load cycles if user is authenticated
		if (this.authStore.isAuthenticated) {
			console.log('Loading cycles for authenticated user...')
			try {
				await this.loadCycles()
				
				// Wait for next tick and add a small delay to ensure reactivity has updated
				await this.$nextTick()
				
				
			} catch (error) {
				console.error('Error during cycle loading:', error)
			}
		} else {
			console.log('User not authenticated, skipping cycle loading')
		}
		
		// Initialize with a fresh cycle (no auto-loading to prevent errors)
		this.resetCycle()
		this.fetchInventoryItems()
	}
}
</script>