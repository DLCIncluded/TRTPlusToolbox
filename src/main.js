import './assets/main.scss'
// import 'bulma/bulma.scss' 
import 'material-symbols/outlined.css'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ToastPlugin);
app.use(createPinia())

const userStore = useUserStore()
userStore.setupFromStorage()

app.use(router)

app.mount('#app')
