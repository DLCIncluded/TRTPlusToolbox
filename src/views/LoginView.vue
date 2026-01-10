<template>
  <div class="container is-max-desktop">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <p class="card-header-title is-centered">
              Sign In to TRT ToolBox
            </p>
          </div>
          <div class="card-content">
            <form @submit.prevent="handleLogin">
              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.username"
                    class="input"
                    :class="{ 'is-danger': errors.username }"
                    type="text"
                    placeholder="Enter your username"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                  </span>
                  <span v-if="errors.username" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p v-if="errors.username" class="help is-danger">
                  {{ errors.username }}
                </p>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.password"
                    class="input"
                    :class="{ 'is-danger': errors.password }"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                  <span v-if="errors.password" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p v-if="errors.password" class="help is-danger">
                  {{ errors.password }}
                </p>
              </div>

              <div class="field">
                <div class="control">
                  <button
                    type="submit"
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': authStore.loading }"
                    :disabled="authStore.loading"
                  >
                    Sign In
                  </button>
                </div>
              </div>

              <div class="field has-text-centered">
                <p class="help">
                  Don't have an account?
                  <router-link to="/register" class="has-text-primary">
                    Sign up here
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: ''
});

const errors = ref({});

const validateForm = () => {
  const newErrors = {};

  if (!form.username.trim()) {
    newErrors.username = 'Username is required';
  } else if (form.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters';
  }

  if (!form.password) {
    newErrors.password = 'Password is required';
  } else if (form.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  const result = await authStore.login({
    username: form.username.trim(),
    password: form.password
  });

  if (result.success) {
    // Redirect to the intended page or home
    const redirectTo = router.currentRoute.value.query.redirect || '/';
    router.push(redirectTo);
  }
};
</script>

<style scoped>
.container {
  padding-top: 3rem;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header-title {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>