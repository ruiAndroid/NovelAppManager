import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/apps'
  },
  {
    path: '/apps',
    name: 'AppList',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('../views/WeijuConfig.vue')
  },
  {
    path: '/ads',
    name: 'AdManagement',
    component: () => import('../views/AdManagement.vue')
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/Payment.vue')
  },
  {
    path: '/general-config',
    name: 'GeneralConfig',
    component: () => import('../views/GeneralConfig.vue')
  },
  {
    path: '/ai-plus',
    name: 'AiPlus',
    component: () => import('../views/AiPlus.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 