<template>
	<div>
		<h1 class="title has-text-centered">Inventory</h1>
	</div>
	
	<article class="panel is-primary">
		<header class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			<p class="panel-title">Inventory Details</p>
		</header>
		<div class="panel-block">
			<p class="control has-icons-left">
				<input class="input" type="text" placeholder="Search inventory..." v-model="searchQuery">
				<span class="icon is-left">
					<i class="fas fa-search"></i>
				</span>
			</p>
		</div>
	</article>

	<article class="panel is-primary">
		<header class="panel-heading mb-0 is-flex is-justify-content-space-between is-align-items-center">
			<p class="panel-title">New Item</p>
		</header>
		<form @submit.prevent="addItem">
			<div class="panel-block">
				<div class="columns is-multiline">
					<!-- Item Type - Full width on mobile, half on tablet, one-third on desktop -->
					<div class="column is-full-mobile is-half-tablet is-one-third-desktop">
						<div class="field is-fullwidth">
							<label class="label is-fullwidth">Item Type</label>
							<div class="control">
								<div class="select is-fullwidth">
									<select v-model="newItem.type_id">
										<option value="" disabled>Select</option>
										<option 
											v-for="type in types" 
											:key="type.id" 
											:value="type.id"
										>
											{{ type.name }}<span v-if="type.ester">&nbsp;{{ type.ester }}</span>
										</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					
					<!-- Injectable fields -->
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isInjectable">
						<div class="field">
							<label class="label">Concentration ({{ selectedType?.unit || 'mg' }} / mL)</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.concentration"
									class="input no-spinner"
									step="0.1"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isInjectable">
						<div class="field">
							<label class="label">Container Size (mL)</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.container_size"
									class="input no-spinner"
									step="0.1"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isInjectable">
						<div class="field">
							<label class="label">Container Count</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.container_count"
									class="input no-spinner"
									min="1"
								>
							</div>
						</div>
					</div>
					
					<!-- Oral fields -->
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isOral">
						<div class="field">
							<label class="label">{{ selectedType?.unit || 'mg' }} per pill</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.concentration"
									class="input no-spinner"
									step="0.1"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isOral">
						<div class="field">
							<label class="label">Pills per Container</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.quantity"
									class="input no-spinner"
									min="1"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isOral">
						<div class="field">
							<label class="label">Container Count</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.container_count"
									class="input no-spinner"
									min="1"
								>
							</div>
						</div>
					</div>
					
					<!-- Topical fields -->
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isTopical">
						<div class="field">
							<label class="label">Concentration ({{ selectedType?.unit || 'mg' }} / g)</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.concentration"
									class="input no-spinner"
									step="0.1"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isTopical">
						<div class="field">
							<label class="label">Container Size (g)</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.container_size"
									class="input no-spinner"
									step="0.1"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="isTopical">
						<div class="field">
							<label class="label">Container Count</label>
							<div class="control">
								<input 
									type="number" 
									v-model="newItem.container_count"
									class="input no-spinner"
									min="1"
								>
							</div>
						</div>
					</div>
					
					<!-- Optional fields for all types -->
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="selectedType">
						<div class="field">
							<label class="label">Expiration Date (Optional)</label>
							<div class="control">
								<input 
									type="date" 
									v-model="newItem.expiration_date"
									class="input"
								>
							</div>
						</div>
					</div>
					
					<div class="column is-half-mobile is-one-quarter-tablet" v-if="selectedType">
						<div class="field">
							<label class="label">Batch Number (Optional)</label>
							<div class="control">
								<input 
									type="text" 
									v-model="newItem.batch_number"
									class="input"
									placeholder="e.g. LOT123"
								>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="panel-block" v-if="selectedType">
				<div class="field is-fullwidth">
					<label class="label">Notes (Optional)</label>
					<div class="control">
						<textarea 
							v-model="newItem.notes"
							class="textarea"
							placeholder="Additional notes about this inventory item..."
							rows="3"
						></textarea>-
					</div>
				</div>
			</div>
			
			<div class="panel-block">
				<div class="control">
					<button 
						class="button is-primary" 
						type="submit"
						:disabled="!selectedType || !newItem.concentration || (!newItem.quantity && !newItem.container_size)"
					>
						Add Item
					</button>
				</div>
			</div>
		</form>
	</article>

	<div class="fixed-grid has-1-cols-mobile has-4-cols-desktop">
		<div class="grid">
			<div class="cell card" v-for="item in searchInventory()" :key="item.id">
				<header class="card-header">
					<p class="card-header-title">
						{{ item.name }}<span v-if="item.ester">&nbsp;{{ item.ester }}</span>
						<span class="tag is-small ml-2" :class="getCategoryClass(item.category)">{{ item.category }}</span>
					</p>
				</header>
				<div class="card-content">
					<div class="content">
						<p><strong>Concentration:</strong> {{ item.concentration }} {{ item.unit }}<span v-if="item.form_type === 'injectable'"> / mL</span><span v-if="item.form_type === 'oral'"> per pill</span><span v-if="item.form_type === 'topical'"> / g</span></p>
						
						<div v-if="item.form_type === 'injectable'">
							<p><strong>Container Size:</strong> {{ item.container_size }} mL</p>
							<div class="field">
								<label class="label is-small"><strong>Container Count:</strong></label>
								<div class="field has-addons">
									<div class="control">
										<button class="button is-small is-outlined" @click="quickUpdateCount(item, -1)" :disabled="item.container_count <= 1">
											<span class="icon is-small"><i class="fas fa-minus"></i></span>
										</button>
									</div>
									<div class="control">
										<input class="input is-small has-text-centered has-background-dark has-text-white" type="text" :value="item.container_count" readonly style="width: 60px;">
									</div>
									<div class="control">
										<button class="button is-small is-outlined" @click="quickUpdateCount(item, 1)">
											<span class="icon is-small"><i class="fas fa-plus"></i></span>
										</button>
									</div>
								</div>
							</div>
							<p><strong>Total Volume:</strong> {{ (item.container_size * item.container_count).toFixed(1) }} mL</p>
							<div><p><strong>Notes:</strong></p> {{ item.notes }}</div>
						</div>
						
						<div v-if="item.form_type === 'oral'">
							<p><strong>Pills per Container:</strong> {{ item.quantity }}</p>
							<div class="field">
								<label class="label is-small"><strong>Container Count:</strong></label>
								<div class="field has-addons">
									<div class="control">
										<button class="button is-small is-outlined" @click="quickUpdateCount(item, -1)" :disabled="item.container_count <= 1">
											<span class="icon is-small"><i class="fas fa-minus"></i></span>
										</button>
									</div>
									<div class="control">
										<input class="input is-small has-text-centered has-background-dark has-text-white" type="text" :value="item.container_count" readonly style="width: 60px;">
									</div>
									<div class="control">
										<button class="button is-small is-outlined" @click="quickUpdateCount(item, 1)">
											<span class="icon is-small"><i class="fas fa-plus"></i></span>
										</button>
									</div>
								</div>
							</div>
							<p><strong>Total Pills:</strong> {{ item.quantity * item.container_count }}</p>
						</div>
						
						<div v-if="item.form_type === 'topical'">
							<p><strong>Container Size:</strong> {{ item.container_size }} g</p>
							<div class="field">
								<label class="label is-small"><strong>Container Count:</strong></label>
								<div class="field has-addons">
									<div class="control">
										<button class="button is-small is-outlined" @click="quickUpdateCount(item, -1)" :disabled="item.container_count <= 1">
											<span class="icon is-small"><i class="fas fa-minus"></i></span>
										</button>
									</div>
									<div class="control">
										<input class="input is-small has-text-centered has-background-dark has-text-white" type="text" :value="item.container_count" readonly style="width: 60px;">
									</div>
									<div class="control">
										<button class="button is-small is-outlined" @click="quickUpdateCount(item, 1)">
											<span class="icon is-small"><i class="fas fa-plus"></i></span>
										</button>
									</div>
								</div>
							</div>
							<p><strong>Total Weight:</strong> {{ (item.container_size * item.container_count).toFixed(1) }} g</p>
						</div>
						
						<div v-if="item.expiration_date" class="mt-2">
							<p class="has-text-grey"><strong>Expires:</strong> {{ formatDate(item.expiration_date) }}</p>
						</div>
						
						<div v-if="item.batch_number" class="mt-1">
							<p class="has-text-grey"><strong>Batch:</strong> {{ item.batch_number }}</p>
						</div>
					</div>
				</div>
				<footer class="card-footer">
					<a href="#" class="card-footer-item" @click="editItem(item)">Edit</a>
					<a href="#" class="card-footer-item" @click="confirmDelete(item)">Delete</a>
				</footer>
			</div>
		</div>
	</div>

	<div class="modal" :class="{ 'is-active': showConfirmModal }" v-if="selectedItemToDelete">
		<div class="modal-background" @click="showConfirmModal = false; selectedItemToDelete = null"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Confirm Delete</p>
				<button class="delete" aria-label="close" @click="showConfirmModal = false; selectedItemToDelete = null"></button>
			</header>
			<section class="modal-card-body">
				<p>Are you sure you want to delete {{ selectedItemToDelete.name }}<span v-if="selectedItemToDelete.ester">&nbsp;{{ selectedItemToDelete.ester}}</span>?</p>
			</section>
			<footer class="modal-card-foot">
				<div class="buttons">
					<button class="button is-danger" @click="deleteItem(selectedItemToDelete)">Delete</button>
					<button class="button" @click="showConfirmModal = false; selectedItemToDelete = null">Cancel</button>
				</div>
			</footer>
		</div>
	</div>
	
	<!-- Edit Modal -->
	<div class="modal" :class="{ 'is-active': showEditModal }" v-if="editingItem">
		<div class="modal-background" @click="cancelEdit"></div>
		<div class="modal-card" style="width: 90%; max-width: 800px;">
			<header class="modal-card-head">
				<p class="modal-card-title">Edit {{ editingItem.name }}<span v-if="editingItem.ester"> {{ editingItem.ester }}</span></p>
				<button class="delete" aria-label="close" @click="cancelEdit"></button>
			</header>
			<section class="modal-card-body">
				<form @submit.prevent="updateItem">
					<div class="columns is-multiline">
						<!-- Concentration -->
						<div class="column is-half">
							<div class="field">
								<label class="label">Concentration ({{ editingItem.unit }}<span v-if="editingItem.form_type === 'injectable'"> / mL</span><span v-if="editingItem.form_type === 'oral'"> per pill</span><span v-if="editingItem.form_type === 'topical'"> / g</span>)</label>
								<div class="control">
									<input 
										type="number" 
										v-model="editForm.concentration"
										class="input"
										step="0.1"
										required
									>
								</div>
							</div>
						</div>
						
						<!-- Quantity (for oral) -->
						<div class="column is-half" v-if="editingItem.form_type === 'oral'">
							<div class="field">
								<label class="label">Pills per Container</label>
								<div class="control">
									<input 
										type="number" 
										v-model="editForm.quantity"
										class="input"
										min="1"
									>
								</div>
							</div>
						</div>
						
						<!-- Container Size (for injectable and topical) -->
						<div class="column is-half" v-if="editingItem.form_type !== 'oral'">
							<div class="field">
								<label class="label">Container Size (<span v-if="editingItem.form_type === 'injectable'">mL</span><span v-if="editingItem.form_type === 'topical'">g</span>)</label>
								<div class="control">
									<input 
										type="number" 
										v-model="editForm.container_size"
										class="input"
										step="0.1"
									>
								</div>
							</div>
						</div>
						
						<!-- Container Count -->
						<div class="column is-half">
							<div class="field">
								<label class="label">Container Count</label>
								<div class="control">
									<input 
										type="number" 
										v-model="editForm.container_count"
										class="input"
										min="1"
										required
									>
								</div>
							</div>
						</div>
						
						<!-- Expiration Date -->
						<div class="column is-half">
							<div class="field">
								<label class="label">Expiration Date (Optional)</label>
								<div class="control">
									<input 
										type="date" 
										v-model="editForm.expiration_date"
										class="input"
									>
								</div>
							</div>
						</div>
						
						<!-- Batch Number -->
						<div class="column is-half">
							<div class="field">
								<label class="label">Batch Number (Optional)</label>
								<div class="control">
									<input 
										type="text" 
										v-model="editForm.batch_number"
										class="input"
										placeholder="e.g. LOT123"
									>
								</div>
							</div>
						</div>
						
						<!-- Notes -->
						<div class="column is-full">
							<div class="field">
								<label class="label">Notes (Optional)</label>
								<div class="control">
									<textarea 
										v-model="editForm.notes"
										class="textarea"
										placeholder="Additional notes about this inventory item..."
										rows="3"
									></textarea>
								</div>
							</div>
						</div>
					</div>
				</form>
			</section>
			<footer class="modal-card-foot">
				<div class="buttons">
					<button class="button is-success" @click="updateItem" :disabled="!editForm.concentration">
						Save Changes
					</button>
					<button class="button" @click="cancelEdit">Cancel</button>
				</div>
			</footer>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
	name: 'InventoryView',
	data() {
		return {
			authStore: useAuthStore(),
			inventoryItems: [],
			searchQuery: '',
			newItem: {
				type_id: '',
				concentration: '',
				quantity: '',
				container_size: '',
				container_count: 1,
				expiration_date: '',
				batch_number: '',
				notes: ''
			},
			types: [],
			showConfirmModal: false,
			showEditModal: false,
			isloading: true,
			selectedItemToDelete: null,
			editingItem: null,
			editForm: {
				concentration: '',
				quantity: '',
				container_size: '',
				container_count: 1,
				expiration_date: '',
				batch_number: '',
				notes: ''
			}
		};
	},
	computed: {
		selectedType() {
			if (!this.newItem.type_id || !this.types.length) return null
			return this.types.find(type => type.id === this.newItem.type_id)
		},
		isInjectable() {
			return this.selectedType?.form_type === 'injectable'
		},
		isOral() {
			return this.selectedType?.form_type === 'oral'
		},
		isTopical() {
			return this.selectedType?.form_type === 'topical'
		}
	},
	mounted() {
		this.fetchInventoryItems();
		this.fetchTypes();
	},
	methods: {
		async fetchTypes() {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to access inventory')
				return
			}
			
			try {
				const response = await this.$axios.get('http://localhost:5000/api/inventory/types')
				console.log('Inventory types:', response.data)
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
		async addItem() {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to add inventory items')
				return
			}
			
			try {
				// Prepare the data for submission
				const itemData = {
					type_id: parseInt(this.newItem.type_id),
					concentration: parseFloat(this.newItem.concentration),
					quantity: this.newItem.quantity ? parseInt(this.newItem.quantity) : 1,
					container_size: this.newItem.container_size ? parseFloat(this.newItem.container_size) : null,
					container_count: parseInt(this.newItem.container_count),
					expiration_date: this.newItem.expiration_date || null,
					batch_number: this.newItem.batch_number || null,
					notes: this.newItem.notes || null
				}
				
				const response = await this.$axios.post('/api/inventory', itemData)
				this.isloading = false
				
				if (response.data && !response.data.error) {
					await this.fetchInventoryItems()
					this.resetNewItem()
					toast.success('Inventory item added successfully')
				} else {
					toast.error(response.data?.message || 'Failed to add inventory item')
				}
			} catch (error) {
				this.isloading = false
				console.error('Error adding inventory item:', error)
				toast.error('Failed to add inventory item')
			}
		},
		resetNewItem() {
			this.newItem = {
				type_id: '',
				concentration: '',
				quantity: '',
				container_size: '',
				container_count: 1,
				expiration_date: '',
				batch_number: '',
				notes: ''
			}
		},
		getCategoryClass(category) {
			const classes = {
				trt: 'is-primary',
				peptide: 'is-info',
				ancillary: 'is-warning',
				vitamin: 'is-success'
			}
			return classes[category] || 'is-light'
		},
		formatDate(dateString) {
			if (!dateString) return 'N/A'
			try {
				return new Date(dateString).toLocaleDateString()
			} catch {
				return dateString
			}
		},
		searchInventory() {
			const query = this.searchQuery.toLowerCase();
			if (!this.inventoryItems || !Array.isArray(this.inventoryItems)) {
				return [];
			}
			return this.inventoryItems.filter(item => {
				const searchableText = `${item.name} ${item.ester || ''} ${item.category} ${item.batch_number || ''}`.toLowerCase();
				return searchableText.includes(query);
			});
		},
		confirmDelete(item) {
			this.showConfirmModal = true;
			this.selectedItemToDelete = item;
			console.log("Selected item to delete:", this.selectedItemToDelete);
		},
		async deleteItem(item) {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to delete inventory items')
				return
			}
			
			try {
				const response = await this.$axios.delete(`/api/inventory/${item.id || item._id}`)
				
				if (response.data && !response.data.error) {
					await this.fetchInventoryItems()
					this.showConfirmModal = false
					this.selectedItemToDelete = null
					toast.success('Item deleted successfully')
				} else {
					toast.error(response.data?.message || 'Failed to delete item')
				}
			} catch (error) {
				console.error('Error deleting inventory item:', error)
				toast.error('Failed to delete item')
			}
		},
		editItem(item) {
			this.editingItem = item
			this.editForm = {
				concentration: item.concentration,
				quantity: item.quantity || '',
				container_size: item.container_size || '',
				container_count: item.container_count,
				expiration_date: item.expiration_date || '',
				batch_number: item.batch_number || '',
				notes: item.notes || ''
			}
			this.showEditModal = true
		},
		cancelEdit() {
			this.showEditModal = false
			this.editingItem = null
			this.editForm = {
				concentration: '',
				quantity: '',
				container_size: '',
				container_count: 1,
				expiration_date: '',
				batch_number: '',
				notes: ''
			}
		},
		async updateItem() {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to update inventory items')
				return
			}
			
			try {
				const itemData = {
					type_id: this.editingItem.type_id,
					concentration: parseFloat(this.editForm.concentration),
					quantity: this.editForm.quantity ? parseInt(this.editForm.quantity) : 1,
					container_size: this.editForm.container_size ? parseFloat(this.editForm.container_size) : null,
					container_count: parseInt(this.editForm.container_count),
					expiration_date: this.editForm.expiration_date || null,
					batch_number: this.editForm.batch_number || null,
					notes: this.editForm.notes || null
				}
				
				const response = await this.$axios.put(`/api/inventory/${this.editingItem.id}`, itemData)
				
				if (response.data && !response.data.error) {
					await this.fetchInventoryItems()
					this.cancelEdit()
					toast.success('Inventory item updated successfully')
				} else {
					toast.error(response.data?.message || 'Failed to update inventory item')
				}
			} catch (error) {
				console.error('Error updating inventory item:', error)
				toast.error('Failed to update inventory item')
			}
		},
		async quickUpdateCount(item, change) {
			if (!this.authStore.isAuthenticated) {
				toast.error('You must be logged in to update inventory')
				return
			}
			
			const newCount = item.container_count + change
			if (newCount < 1) return
			
			try {
				const itemData = {
					type_id: item.type_id,
					concentration: item.concentration,
					quantity: item.quantity || 1,
					container_size: item.container_size || null,
					container_count: newCount,
					expiration_date: item.expiration_date || null,
					batch_number: item.batch_number || null,
					notes: item.notes || null
				}
				
				const response = await this.$axios.put(`/api/inventory/${item.id}`, itemData)
				
				if (response.data && !response.data.error) {
					// Update the item locally for immediate UI feedback
					item.container_count = newCount
					toast.success(`Container count ${change > 0 ? 'increased' : 'decreased'} to ${newCount}`)
				} else {
					toast.error(response.data?.message || 'Failed to update count')
				}
			} catch (error) {
				console.error('Error updating count:', error)
				toast.error('Failed to update count')
			}
		}
	}
}
</script>

<style scoped>
	.grid .card:last-child{
		margin-bottom: var(--bulma-block-spacing); /* fix for last card being wrong size */
	}
	
	/* Ensure select dropdowns don't get too narrow */
	.select.is-fullwidth {
		min-width: 200px;
	}
	
	/* Better spacing for form fields */
	.column .field {
		margin-bottom: 1rem;
	}
	
	/* Ensure consistent card heights */
	.grid .cell.card {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.card-content {
		flex-grow: 1;
	}
	
	.card-footer {
		margin-top: auto;
	}
	
	/* Style the container count controls */
	.field .label.is-small {
		margin-bottom: 0.25rem;
		font-size: 0.85rem;
	}
	
	/* Tone down the +/- buttons */
	.button.is-outlined.is-small {
		border-color: #dbdbdb;
		color: #4a4a4a;
	}
	
	.button.is-outlined.is-small:hover {
		border-color: #3273dc;
		color: #3273dc;
	}
	
	.button.is-outlined.is-small:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>