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
    path: '/users',
    name: 'UserList',
    component: () => import('../views/UserList.vue')
  },
  {
    path: '/ads',
    name: 'AdManagement',
    component: () => import('../views/AdManagement.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/novels/add',
    name: 'AddNovel',
    component: () => import('../views/NovelEdit.vue')
  },
  {
    path: '/novels/edit/:id',
    name: 'EditNovel',
    component: () => import('../views/NovelEdit.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 