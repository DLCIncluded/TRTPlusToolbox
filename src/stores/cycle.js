import { defineStore } from 'pinia';
import { cycleAPI } from '@/api';
import { useToast } from 'vue-toastification';

export const useCycleStore = defineStore('cycle', {
  state: () => ({
    cycles: [],
    currentCycle: null,
    loading: false,
    error: null
  }),

  getters: {
    cycleCount: (state) => state.cycles.length,
    getCycleById: (state) => (id) => state.cycles.find(cycle => cycle.id === id),
    sortedCycles: (state) => [...state.cycles].sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )
  },

  actions: {
    /**
     * Load all cycles for the current user
     */
    async loadCycles() {
      this.loading = true;
      this.error = null;

      try {
        const response = await cycleAPI.getCycles();
        this.cycles = response.cycles || [];
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load cycles';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new cycle
     */
    async createCycle(cycleData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await cycleAPI.createCycle(cycleData);
        
        // Add the new cycle to the local store
        this.cycles.unshift(response.cycle);
        this.currentCycle = response.cycle;
        
        const toast = useToast();
        toast.success('Cycle saved successfully!');
        
        return { success: true, cycle: response.cycle };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create cycle';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update an existing cycle
     */
    async updateCycle(cycleId, cycleData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await cycleAPI.updateCycle(cycleId, cycleData);
        
        // Update the cycle in the local store
        const index = this.cycles.findIndex(cycle => cycle.id === cycleId);
        if (index !== -1) {
          this.cycles[index] = response.cycle;
        }
        
        if (this.currentCycle?.id === cycleId) {
          this.currentCycle = response.cycle;
        }
        
        const toast = useToast();
        toast.success('Cycle updated successfully!');
        
        return { success: true, cycle: response.cycle };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update cycle';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete a cycle
     */
    async deleteCycle(cycleId) {
      this.loading = true;
      this.error = null;

      try {
        await cycleAPI.deleteCycle(cycleId);
        
        // Remove the cycle from the local store
        this.cycles = this.cycles.filter(cycle => cycle.id !== cycleId);
        
        if (this.currentCycle?.id === cycleId) {
          this.currentCycle = null;
        }
        
        const toast = useToast();
        toast.success('Cycle deleted successfully');
        
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete cycle';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Duplicate a cycle
     */
    async duplicateCycle(cycleId, newTitle) {
      this.loading = true;
      this.error = null;

      try {
        const response = await cycleAPI.duplicateCycle(cycleId, newTitle);
        
        // Add the duplicated cycle to the local store
        this.cycles.unshift(response.cycle);
        
        const toast = useToast();
        toast.success('Cycle duplicated successfully!');
        
        return { success: true, cycle: response.cycle };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to duplicate cycle';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Load a specific cycle
     */
    async loadCycle(cycleId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await cycleAPI.getCycle(cycleId);
        this.currentCycle = response.cycle;
        
        return { success: true, cycle: response.cycle };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load cycle';
        
        const toast = useToast();
        toast.error(this.error);
        
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Set the current cycle (for local state management)
     */
    setCurrentCycle(cycle) {
      this.currentCycle = cycle;
    },

    /**
     * Clear the current cycle
     */
    clearCurrentCycle() {
      this.currentCycle = null;
    },

    /**
     * Clear all cycles (e.g., on logout)
     */
    clearCycles() {
      this.cycles = [];
      this.currentCycle = null;
      this.error = null;
    }
  }
});