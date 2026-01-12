import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore();
        await authStore.logout();
        next('/login');
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cycleplanner',
      name: 'cycleplanner',
      component: () => import('../views/CyclePlanner.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cyclecalendar',
      name: 'cyclecalendar',
      component: () => import('../views/CycleCalendarView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dosagecalc',
      name: 'dosagecalc',
      component: () => import('../views/DosageCalcView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/vialcalc',
      name: 'vialcalc',
      component: () => import('../views/VialCalcView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated) {
      // Redirect to login with the intended destination
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;