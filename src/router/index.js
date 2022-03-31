
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/mf_templateViews/HomeView.vue'
import env from '../config/env'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(env.BASE_URL),
  routes
})

export default router
