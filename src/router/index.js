import { createRouter, createWebHistory } from 'vue-router'
import UserDashboardView from '../views/UserDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserDashboardView,
      alias: ['/dashboard-vue', '/en/dashboard-vue', '/zh-hans/dashboard-vue'],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/notification',
      name: 'notification',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/NotificationView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/trouble-login',
      name: 'trouble-login',
      component: () => import('../views/TroubleLoginView.vue')
    },
    {
      path: '/my-test-history',
      name: 'my-test-history',
      component: () => import('../views/MyTestHistoryView.vue')
    },
    {
      path: '/my-wallet',
      name: 'my-wallet',
      component: () => import('../views/MyWalletView.vue')
    },
    {
      path: '/my-profile',
      name: 'my-profile',
      component: () => import('../views/MyProfileView.vue')
    }
  ],
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
