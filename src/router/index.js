import { createRouter, createWebHistory } from 'vue-router'
import FrontView from '../views/FrontView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FrontView,
      alias: ['/dashboard-vue', '/en/dashboard-vue', '/zh-hans/dashboard-vue'],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
