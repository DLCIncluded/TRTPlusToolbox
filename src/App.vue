<template>
  <main class="container mt-6 p-3">
    <NavBar />
    
    <div class="content is-widescreen">
      <RouterView />
    </div>
  </main>
</template>

<script>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'TRTPlusToolbox',
  components: {
    NavBar
  },
  setup() {
    const authStore = useAuthStore();
    
    onMounted(() => {
      // Initialize auth store from localStorage on app start
      authStore.init();
    });
    
    return {};
  }
}
</script>

