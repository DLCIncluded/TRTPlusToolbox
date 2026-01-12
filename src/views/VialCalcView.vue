<template>
	<div class="card">
		<header class="card-header">
			<p class="card-header-title">Vial Calculator</p>
		</header>
		<div class="card-content">
			<div class="content fixed-grid has-1-cols-mobile has-5-cols-desktop">
				<div class="grid">
					<div class="field cell">
						<label class="label">Type</label>
						<div class="control">
							<div class="select is-fullwidth">
								<select v-model="newItem.type_id">
									<option value="" disabled>Select</option>
									<option 
										v-for="type in availableTypes" 
										:key="type.id" 
										:value="type.id"
									>
										{{ type.name }}<span v-if="type.ester">&nbsp;{{ type.ester }}</span>
									</option>
								</select>
							</div>
						</div>
					</div>
					<div class="field cell" >
						<label class="label">Concentration</label>
						<div class="control has-icons-right">
							<input 
								type="number" 
								class="input no-spinner"
								min="0"
								placeholder="ex: 250"
								v-model="newItem.concentration"
							/>
							<span class="" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%)">
								<i>mg/mL</i>
							</span>
						</div>
					</div>
					<div class="field cell" >
						<label class="label">Weekly Dose</label>
						<div class="control has-icons-right">
							<input 
								type="number" 
								class="input no-spinner"
								min="0"
								placeholder="ex: 250"
								v-model="newItem.weeklyDose"
							/>
							<span class="" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%)">
								<i>mg</i>
							</span>
						</div>
					</div>
					<div class="field cell" >
						<label class="label">&nbsp;</label>
						<div class="control">
							<button 
								class="button is-primary" 
								type="submit"
								:disabled="!selectedType || !newItem.concentration || !newItem.weeklyDose"
								@click="addItem"
							>
								Add Item
							</button>
						</div>
					</div>
				</div>

					
			</div>
			<div class="content fixed-grid has-1-cols-mobile has-5-cols-desktop">
				<div class="grid">
					<div class="field cell">
						
						<div class="control">
							<label class="label">Shots Per Week</label>
								<select 
									v-model="dosesPerWeek"
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
					</div>
					<div class="field cell">
						
						<div class="control">
							<label class="label">Weeks To Make</label>
							<input 
								type="number" 
								class="input"
								min="1"
								placeholder="ex: 2"
								v-model="weeksToMake"
							/>
						</div>
					</div>
				</div>

					
			</div>
		</div>
		

	</div>
	
	<!-- Vial Items Display -->
	<article class="panel is-primary" v-if="vialItems.length > 0">
		<p class="panel-heading">Current Vial Items</p>
		<div class="panel-block">
			<div class="table-container" style="width: 100%">
				<table class="table is-fullwidth is-striped">
					<thead>
						<tr>
							<th>Type</th>
							<th>Concentration (mg/mL)</th>
							<th>Weekly Dose (mg)</th>
							<th>mL per Week</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in vialItems" :key="index">
							<td>
								<span v-if="!item.editing">
									{{ getTypeName(item.type_id) }}
								</span>
								<div v-else class="select is-small">
									<select v-model="item.type_id">
										<option 
											v-for="type in types" 
											:key="type.id" 
											:value="type.id"
											:disabled="vialItems.some((vi, i) => i !== index && vi.type_id === type.id)"
										>
											{{ type.name }}<span v-if="type.ester">&nbsp;{{ type.ester }}</span>
										</option>
									</select>
								</div>
							</td>
							<td>
								<span v-if="!item.editing">{{ item.concentration }}</span>
								<input v-else v-model.number="item.concentration" class="input is-small" type="number" min="0" />
							</td>
							<td>
								<span v-if="!item.editing">{{ item.weeklyDose }}</span>
								<input v-else v-model.number="item.weeklyDose" class="input is-small" type="number" min="0" />
							</td>
							<td>
								{{ (item.weeklyDose / item.concentration).toFixed(2) }}
							</td>
							<td>
								<div class="buttons are-small">
									<button v-if="!item.editing" @click="editItem(index)" class="button is-warning is-small">
										<span class="icon is-small">
											<i class="fas fa-edit"></i>
										</span>
									</button>
									<button v-if="item.editing" @click="saveItem(index)" class="button is-success is-small">
										<span class="icon is-small">
											<i class="fas fa-check"></i>
										</span>
									</button>
									<button v-if="item.editing" @click="cancelEdit(index)" class="button is-light is-small">
										<span class="icon is-small">
											<i class="fas fa-times"></i>
										</span>
									</button>
									<button @click="removeItem(index)" class="button is-danger is-small">
										<span class="icon is-small">
											<i class="fas fa-trash"></i>
										</span>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</article>
	
	<!-- Recipe Table -->
	<article class="panel is-primary" v-if="vialItems.length > 0 && weeksToMake > 0">
		<p class="panel-heading">Recipe: {{ weeksToMake }} Week{{ weeksToMake > 1 ? 's' : '' }} Supply</p>
		<div class="panel-block">
			<div class="table-container" style="width: 100%">
				<table class="table is-fullwidth is-striped">
					<thead>
						<tr>
							<th>Compound</th>
							<th>Amount to Add</th>
							<th>Concentration</th>
							<th>Weekly Dose</th>
							<th>Total Dose Needed</th>
							
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in vialItems" :key="index">
							<td class="has-text-weight-semibold">
								{{ getTypeName(item.type_id) }}
							</td>
							<td class="has-text-weight-bold has-text-primary">
								{{ ((item.weeklyDose * weeksToMake) / item.concentration).toFixed(2) }} mL
							</td>
							<td>
								{{ item.concentration }} mg/mL
							</td>
							<td>
								{{ item.weeklyDose }} mg
							</td>
							<td>
								{{ (item.weeklyDose * weeksToMake).toFixed(1) }} mg
							</td>
							
						</tr>
					</tbody>
					<tfoot>
						<tr class="has-background-primary">
							<td class="has-text-weight-bold">Total Volume:</td>
							<td colspan="4" class="has-text-weight-bold has-text-white">
								{{ getTotalRecipeVolume() }} mL
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<div class="panel-block">
			<div class="content">
				<p class="has-text-grey">
					<strong>Instructions:</strong> Add the specified amount of each compound to your vial to create a 
					{{ weeksToMake }}-week supply. Final vial volume will be {{ getTotalRecipeVolume() }} mL.
				</p>
			</div>
		</div>
	</article>

	<div class="card" v-if="vialItems.length > 0">
		<header class="card-header">
			<p class="card-header-title">Syringe Example</p>
		</header>
		<div class="card-content">
			<div class="content fixed-grid has-1-cols-mobile has-5-cols-desktop">
				<div class="grid">
					<div class="field cell">
						<label class="label">Syringe Type</label>
						<div class="control">
							<div class="select is-fullwidth">
								<select name="cycle" v-model="selectedUnit">
									<option value="ml">mL</option>
									<option value="units">Units</option>
								</select>
							</div>
							
						</div>
					</div>
					<div class="field cell">
						<label class="label">Syringe Size</label>
						<div class="control">
							<div class="select is-fullwidth">
								<select name="cycle" v-model="syringeSize">
									<option value=1>1mL</option>
									<option value=3>3mL</option>
								</select>
							</div>
							
						</div>
					</div>

				</div>
			</div>

			<SyringeScale 
				v-if="vialItems.length > 0"
				:value="doseMl" 
				:max-value="100 * syringeSize" 
				:unit="selectedUnit"
			/>
		</div>

	</div>
	
	<article class="panel is-primary" v-if="currentEnv == 'development'">
		<p class="panel-heading">Debugging</p>
		<div class="panel-block">
			<!-- <div class="field">
				<button @click="testAPI" class="button is-info">Test API Connection</button>
			</div> -->
			<pre>{{ vialItems }}</pre>
			<!-- <pre>
				{{ availableTypes }}
			</pre> -->
			

		</div>
		<div class="panel-block">
			<p><strong>Total mL per Week:</strong> {{ totalMl }} mL</p>
			
		</div>
		<div class="panel-block">
			<p><strong>Dose per Injection:</strong> {{ doseMl }} mL</p>
		</div>
	</article>


</template>

<script>
import { useAuthStore } from '@/stores/auth'
import SyringeScale from '@/components/SyringeScale.vue';
import { useToast } from "vue-toastification";
const toast = useToast();
const currentEnv = import.meta.env.VITE_ENV || 'development';

export default {
	data() {
		return {
			currentEnv,
			authStore: useAuthStore(),
			types: [],
			inventoryItems: [],
			isloading: true,
			types: [],
			newItem: {
				type_id: '',
				weeklyDose: null,
				concentration: null,
			},
			vialItems: [],
			dosesPerWeek: 3,
			originalItemData: {}, 
			selectedUnit: "ml",
			syringeSize: 1,
			weeksToMake: 1,
		};
	},
	mounted() {
		this.fetchInventoryItems();
		this.fetchTypes();
		this.loadFromLocalStorage();
	},
	components: {
		SyringeScale
	},

	computed: {
		// availableTypes() {
		// 	return this.types.filter(type => {

		// 		return !this.vialItems.some(item => item.type_id === type.id)
		// 	})
		// },
		availableTypes() {
			return this.types.filter(type => type.category === 'trt')
			.filter(type => !this.vialItems.some(item => item.type_id === type.id))
		},
		selectedType() {
			if (!this.newItem.type_id || !this.types.length) return null
			return this.types.find(type => type.id === this.newItem.type_id)
		},
		totalMl() {
			let total = 0
			this.vialItems.forEach(item => {
				if (item.concentration && item.weeklyDose) {
					total += item.weeklyDose / item.concentration
				}
			})
			return total.toFixed(2) * this.weeksToMake
		},
		doseMl() {
			let doseMl = 0
			this.vialItems.forEach(item => {
				if (item.concentration && item.weeklyDose) {
					doseMl += item.weeklyDose / item.concentration
				}
			})
			
			if (this.dosesPerWeek === 0 || doseMl === 0) {
				return "0.00"
			}
			
			let dosePerInjection = doseMl / this.dosesPerWeek
			
			return dosePerInjection.toFixed(2)
		}
	},
	watch: {
		dosesPerWeek() {
			this.saveToLocalStorage()
		},
		weeksToMake() {
			this.saveToLocalStorage()
		}
	},
	methods: {
		addItem() {
			if (!this.selectedType) {
				toast.error('Please select a valid type')
				return
			}
			if (!this.newItem.concentration || this.newItem.concentration <= 0) {
				toast.error('Please enter a valid concentration')
				return
			}
			if (!this.newItem.weeklyDose || this.newItem.weeklyDose <= 0) {
				toast.error('Please enter a valid weekly dose')
				return
			}

			const itemToAdd = {
				type_id: this.newItem.type_id,
				weeklyDose: this.newItem.weeklyDose,
				concentration: this.newItem.concentration,
			}

			this.vialItems.push(itemToAdd)
			this.saveToLocalStorage()

			// Reset form
			this.newItem.type_id = ''
			this.newItem.weeklyDose = null
			this.newItem.concentration = null

			toast.success('Item added to vial')
		},
		async fetchTypes() {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to access inventory')
				return
			}
			
			try {
				const response = await this.$axios.get('/api/inventory/types')
				if (response.data && response.data.types) {
					this.types = response.data.types
				} else {
					toast.error('Failed to load inventory types')
				}
			} catch (error) {
				console.error('Error fetching types:', error)
				toast.error('Failed to load inventory types')
			}
		},
		async fetchInventoryItems() {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to access inventory')
				this.isloading = false
				return
			}
			
			try {
				const response = await this.$axios.get('/api/inventory')
				this.isloading = false
				
				if (response.data && response.data.inventory) {
					console.log('Inventory items:', response.data.inventory)
					this.inventoryItems = response.data.inventory
				} else {
					toast.error('Failed to load inventory items')
				}
			} catch (error) {
				this.isloading = false
				console.error('Error fetching inventory:', error)
				toast.error('Failed to load inventory items')
			}
		},
		getTypeName(typeId) {
			const type = this.types.find(t => t.id === typeId)
			return type ? `${type.name}${type.ester ? ' ' + type.ester : ''}` : 'Unknown Type'
		},
		editItem(index) {
			// Store original data for cancel functionality
			this.originalItemData[index] = { ...this.vialItems[index] }
			// Set editing flag
			this.vialItems[index].editing = true
		},
		saveItem(index) {
			const item = this.vialItems[index]
			
			// Validation
			if (!item.type_id) {
				toast.error('Please select a valid type')
				return
			}
			if (!item.concentration || item.concentration <= 0) {
				toast.error('Please enter a valid concentration')
				return
			}
			if (!item.weeklyDose || item.weeklyDose <= 0) {
				toast.error('Please enter a valid weekly dose')
				return
			}
			
			// Check for duplicate types (excluding current item)
			const duplicateType = this.vialItems.some((vi, i) => 
				i !== index && vi.type_id === item.type_id
			)
			if (duplicateType) {
				toast.error('This type is already added to the vial')
				return
			}
			
			// Save changes
			this.vialItems[index].editing = false
			delete this.originalItemData[index]
			this.saveToLocalStorage()
			toast.success('Item updated successfully')
		},
		cancelEdit(index) {
			// Restore original data
			if (this.originalItemData[index]) {
				const original = this.originalItemData[index]
				this.vialItems[index].type_id = original.type_id
				this.vialItems[index].concentration = original.concentration
				this.vialItems[index].weeklyDose = original.weeklyDose
				delete this.originalItemData[index]
			}
			this.vialItems[index].editing = false
		},
		removeItem(index) {
			this.vialItems.splice(index, 1)
			this.saveToLocalStorage()
			toast.success('Item removed from vial')
		},
		saveToLocalStorage() {
			try {
				const dataToSave = {
					vialItems: this.vialItems.map(item => ({
						type_id: item.type_id,
						concentration: item.concentration,
						weeklyDose: item.weeklyDose
					})),
					dosesPerWeek: this.dosesPerWeek,
					weeksToMake: this.weeksToMake
				}
				localStorage.setItem('vialCalcData', JSON.stringify(dataToSave))
			} catch (error) {
				console.error('Error saving to localStorage:', error)
			}
		},
		loadFromLocalStorage() {
			try {
				const savedData = localStorage.getItem('vialCalcData')
				if (savedData) {
					const parsed = JSON.parse(savedData)
					if (parsed.vialItems) {
						this.vialItems = parsed.vialItems
					}
					if (parsed.dosesPerWeek) {
						this.dosesPerWeek = parsed.dosesPerWeek
					}
					if (parsed.weeksToMake) {
						this.weeksToMake = parsed.weeksToMake
					}
					console.log('Loaded vial calc data from localStorage:', parsed)
				}
			} catch (error) {
				console.error('Error loading from localStorage:', error)
			}
		},
		getTotalRecipeVolume() {
			return this.vialItems.reduce((total, item) => {
				const itemVolume = (item.weeklyDose * this.weeksToMake) / item.concentration
				return total + itemVolume
			}, 0).toFixed(2)
		},
	},
	
};
</script>