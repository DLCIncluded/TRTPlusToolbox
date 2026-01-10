<template>
	<div class="card">
		<header class="card-header">
			<p class="card-header-title">Dosage Calculator</p>
		</header>
		<div class="card-content">
			<div class="content fixed-grid has-1-cols-mobile has-5-cols-desktop">
				<div class="grid">
					<div class="field cell">
						<label class="label">Type</label>
						<div class="control">
							<div class="select is-fullwidth">
								<select name="cycle" v-model="selectedType">
									<option v-for="value in ['Oil', 'Peptide', 'HGH']" :value="value" >{{value}}</option>
								</select>
							</div>
							
						</div>
					</div>

					<div class="field cell" v-if="selectedType === 'Oil'">
						<label class="label">Concentration</label>
						<div class="control has-icons-right">
							<input 
								type="number" 
								class="input no-spinner"
								min="0"
								placeholder="ex: 250"
								v-model="concentration"
							/>
							<span class="" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%)">
								<i>mg/mL</i>
							</span>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'Oil'">
						<label class="label">Desired MG</label>
						<div class="control has-icons-right">
							<input 
								type="number" 
								class="input no-spinner"
								min="0"
								placeholder="ex: 50"
								v-model="desiredDose"
							/>
							<span class="icon is-small is-right">
							mg
							</span>
						</div>
					</div>

					<div class="field cell" v-if="selectedType === 'Peptide'">
						<label class="label">
							MG in Vial
						</label>
						<div class="control has-icons-right">
							<input class="input no-spinner" type="number" placeholder="ex: 10" v-model="mgInVial" />
							<span class="icon is-small is-right">
							mg
							</span>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'Peptide'">
						<label class="label">
							BAC in Vial
						</label>
						<div class="control has-icons-right">
							<input class="input no-spinner" type="number" placeholder="ex: 3" v-model="mlInVial" />
							<span class="icon is-small is-right">
							mL
							</span>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'Peptide'">
						<label class="label">MG or MCG?</label>
						<div class="control has-icons-left has-icons-right">
							<div class="select is-fullwidth">
								<select name="cycle" v-model="selectedDoseUnit">
									<option v-for="value in ['mcg', 'mg']" :value="value" >{{value}}</option>
								</select>
							</div>
							<span class="icon is-small is-left">
							<i class="fas fa-calendar"></i>
							</span>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'Peptide'">
						<label class="label">
							Desired Dose
						</label>
						<div class="control has-icons-right">
							<input class="input no-spinner" type="number" placeholder="ex: 250" v-model="desiredDose" />
							<span class="icon is-small is-right">
							{{selectedDoseUnit}}
							</span>
						</div>
					</div>

					<div class="field cell" v-if="selectedType === 'HGH'">
						<label class="label">iu or mg</label>
						<div class="control has-icons-right">
							<div class="select is-fullwidth">
								<select name="cycle" v-model="selectedDoseUnit">
									<option v-for="value in ['iu', 'mg']" :value="value" >{{value}}</option>
								</select>
							</div>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'HGH'">
						<label class="label">
							{{selectedDoseUnit}} in Vial
						</label>
						<div class="control has-icons-right">
							<input class="input no-spinner" type="number" placeholder="ex: 10" v-model="mgInVial" />
							<span class="icon is-small is-right">
							{{selectedDoseUnit}}
							</span>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'HGH'">
						<label class="label">
							Bac in Vial
						</label>
						<div class="control has-icons-right">
							<input class="input no-spinner" type="number" placeholder="ex: 10" v-model="mlInVial" />
							<span class="icon is-small is-right">
							mL
							</span>
						</div>
					</div>
					<div class="field cell" v-if="selectedType === 'HGH'">
						<label class="label">
							Desired Dose
						</label>
						<div class="control has-icons-right">
							<input class="input no-spinner" type="number" placeholder="ex: 5" v-model="desiredDose" />
							<span class="icon is-small is-right">
							{{selectedDoseUnit}}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
	<div class="card">
		<header class="card-header">
			<p class="card-header-title">Syringe Scale</p>
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
				v-if="selectedType"
				:value="calculatedDose" 
				:max-value="100 * syringeSize" 
				:unit="selectedUnit"
			/>
		</div>

	</div>
</template>

<script>
import SyringeScale from '@/components/SyringeScale.vue';
export default {
	data() {
		return {
			selectedType: null,
			mgInVial: null,
			mlInVial: null,
			desiredDose: null,
			selectedDoseUnit: "mcg",
			selectedUnit: "ml",
			concentration: null,
			syringeSize: 1,
		};
	},
	components: {
		SyringeScale
	},
	computed: {
		calculatedDose() {
			if (this.selectedType == 'Peptide') {
				if (this.mgInVial == 0 && this.mlInVial == 0 && this.desiredDose == 0){ return 0 }


				const concentration = this.mgInVial / this.mlInVial
				if(this.selectedDoseUnit == 'mg'){
					// return +(this.desiredDose / concentration).toFixed(2) // the plus is to convert back to a number
					return isNaN(this.desiredDose / concentration) ? 0 : +(this.desiredDose / concentration).toFixed(2) // to handle NaN
				}else{
					// return +((this.desiredDose / concentration) / 1000).toFixed(2) // the plus is to convert back to a number
					return isNaN(((this.desiredDose / concentration) / 1000)) ? 0 : +((this.desiredDose / concentration) / 1000).toFixed(2) // to handle NaN
				}
			}else if(this.selectedType == 'Oil') {
				// return +(this.desiredDose / this.concentration).toFixed(2) // the plus is to convert back to a number
				this.selectedDoseUnit = 'mg'
				return isNaN(this.desiredDose / this.concentration) || !isFinite(this.desiredDose / this.concentration) ? 0 : +(this.desiredDose / this.concentration).toFixed(2) // handle NaN and infinity
			}
			else if(this.selectedType == 'HGH') {
				let concentration = this.mgInVial / this.mlInVial;

				// return +(this.desiredDose / this.concentration).toFixed(2) // the plus is to convert back to a number
				return isNaN(this.desiredDose / concentration) || !isFinite(this.desiredDose / concentration) ? 0 : +(this.desiredDose / concentration).toFixed(2) // handle NaN and infinity
			}
			
		},
	}
};
</script>