import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/auth.service';
import HomeView from '../views/HomeView.vue'
import AuthCallback from '../views/AuthCallback.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
	  meta: { requiresAuth: true }
    },
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/Login.vue'),
	},
	{
		path: '/auth/callback',
		name: 'AuthCallback',
		component: AuthCallback,
	},
	{
		path: '/logout',
		name: 'logout',
		beforeEnter: (to,from,next) => {
			authService.logout();
			next('/login')
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
		component: () => import('../views/Profile.vue'),
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
		component: () => import('../views/Profile.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/dosagecalc',
		name: 'dosagecalc',
		component: () => import('../views/Profile.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/vialcalc',
		name: 'vialcalc',
		component: () => import('../views/Profile.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/settings',
		name: 'settings',
		component: () => import('../views/Profile.vue'),
		meta: { requiresAuth: true }
	},
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!authService.isAuthenticated()) {
			next({ name: 'login' });
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;