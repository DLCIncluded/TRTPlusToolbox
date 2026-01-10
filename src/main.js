import './assets/main.scss'
// import 'bulma/bulma.scss' 
import 'material-symbols/outlined.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useAuthStore } from '@/stores/auth'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axiosInstance from './axios.js';

const app = createApp(App)
app.use(Toast, {
  maxToasts: 3,
});

// Initialize Pinia first
const pinia = createPinia()
app.use(pinia)

//create global axios instance
app.config.globalProperties.$axios = axiosInstance;

// Initialize auth store after Pinia is set up
const authStore = useAuthStore()
authStore.init()

app.use(router)

app.mount('#app')
