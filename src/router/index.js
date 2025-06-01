import { createRouter, createWebHistory } from 'vue-router'
import TheLogin from '../views/auth/TheLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: TheLogin,
    },
  ],
})

export default router
