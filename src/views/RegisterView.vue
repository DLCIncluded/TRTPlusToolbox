<template>
  <div class="container is-max-desktop">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <p class="card-header-title is-centered">
              Create Your TRT ToolBox Account
            </p>
          </div>
          <div class="card-content">
            <form @submit.prevent="handleRegister">
              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.username"
                    class="input"
                    :class="{ 'is-danger': errors.username }"
                    type="text"
                    placeholder="Choose a username"
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
                <p class="help">Username must be at least 3 characters long</p>
              </div>

              <div class="field">
                <label class="label">Email (Optional)</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.email"
                    class="input"
                    :class="{ 'is-danger': errors.email }"
                    type="email"
                    placeholder="your@email.com"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span v-if="errors.email" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p v-if="errors.email" class="help is-danger">
                  {{ errors.email }}
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
                    placeholder="Enter a secure password"
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
                <p class="help">Password must be at least 6 characters long</p>
              </div>

              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.confirmPassword"
                    class="input"
                    :class="{ 'is-danger': errors.confirmPassword }"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                  <span v-if="errors.confirmPassword" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </div>
                <p v-if="errors.confirmPassword" class="help is-danger">
                  {{ errors.confirmPassword }}
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
                    Create Account
                  </button>
                </div>
              </div>

              <div class="field has-text-centered">
                <p class="help">
                  Already have an account?
                  <router-link to="/login" class="has-text-primary">
                    Sign in here
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
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref({});

const validateForm = () => {
  const newErrors = {};

  if (!form.username.trim()) {
    newErrors.username = 'Username is required';
  } else if (form.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters';
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  if (!form.password) {
    newErrors.password = 'Password is required';
  } else if (form.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  const userData = {
    username: form.username.trim(),
    password: form.password
  };

  if (form.email.trim()) {
    userData.email = form.email.trim();
  }

  const result = await authStore.register(userData);

  if (result.success) {
    // Redirect to login page after successful registration
    router.push('/login');
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