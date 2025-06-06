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
    component: () => import('../views/AiPlus.vue'),
    meta: { title: 'AI+' }
  },
  {
    path: '/ai-build',
    name: 'AiBuild',
    component: () => import('../views/AiBuild.vue'),
    meta: { title: '智能构建小程序' }
  },
  {
    path: '/ai-publish',
    name: 'AiPublish',
    component: () => import('../views/AiPublish.vue'),
    meta: { title: '全平台自动发布中心' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 