import { defineStore } from 'pinia';
import axios from '@/axios';
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
        console.log('Loading cycles from API...');
        const response = await axios.get('/api/cycles');
        console.log('Cycles loaded:', response.data.cycles);
        this.cycles = response.data.cycles || [];

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
        const response = await axios.post('/api/cycles', cycleData);

        // console.log('Cycle creation response:', response);

        const newCycleData = response.data.cycle;

        // Add the new cycle to the local store
        this.cycles.unshift(newCycleData);
        this.currentCycle = newCycleData;
        
        return { success: true, cycle: newCycleData };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create cycle (in store)';
        
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
        const response = await axios.put(`/api/cycles/${cycleId}`, cycleData);

        // Update the cycle in the local store
        const index = this.cycles.findIndex(cycle => cycle.id === cycleId);
        if (index !== -1) {
          this.cycles[index] = response.data.cycle;
        }

        if (this.currentCycle?.id === cycleId) {
          this.currentCycle = response.data.cycle;
        }
        
        const toast = useToast();
        toast.success('Cycle updated successfully!');
        
        return { success: true, cycle: response.data.cycle };
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
        await axios.delete(`/api/cycles/${cycleId}`);
        
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
        const payload = newTitle ? { title: newTitle } : {};
        const response = await axios.post(`/api/cycles/${cycleId}/duplicate`, payload);

        // Add the duplicated cycle to the local store
        this.cycles.unshift(response.data.cycle);
        
        const toast = useToast();
        toast.success('Cycle duplicated successfully!');
        
        return { success: true, cycle: response.data.cycle };
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
        const response = await axios.get(`/api/cycles/${cycleId}`);
        this.currentCycle = response.data.cycle;
        console.log('Loaded cycle:', this.currentCycle);
        
        return { success: true, cycle: response.data.cycle };
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