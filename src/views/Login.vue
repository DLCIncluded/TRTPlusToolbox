<template>
  <div>
    <!-- Redirect component - this file is deprecated -->
    <LoginView />
  </div>
</template>

<script>
// DEPRECATED: This file redirects to the new LoginView
// This file can be removed after updating all references
import LoginView from './LoginView.vue';

export default {
  name: 'Login',
  components: {
    LoginView
  }
}
</script>