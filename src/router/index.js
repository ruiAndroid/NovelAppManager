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
    path: '/wenqu-auto',
    name: 'WenquAuto',
    component: () => import('../views/WenquAuto.vue'),
    meta: { title: '文曲自动化' }
  },
  {
    path: '/auto-build',
    name: 'AutoBuild',
    component: () => import('../views/AutoBuild.vue'),
    meta: { title: '智能构建小程序' }
  },
  {
    path: '/auto-publish',
    name: 'AutoPublish',
    component: () => import('../views/AutoPublish.vue'),
    meta: { title: '全平台自动发布中心' }
  },
  {
    path: '/auto-create',
    name: 'AutoCreate',
    component: () => import('../views/AutoCreate.vue'),
    meta: { title: '创意小程序孵化器' }
  },
  {
    path: '/generate-app',
    name: 'generate-app',
    component: () => import('../components/autoCreate/AutoCreateGenerateApp.vue'),
    meta: {
      title: '小程序生成'
    }
  },
  {
    path: '/wenqu-ai',
    name: 'WenquAi',
    component: () => import('../views/WenquAi.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 