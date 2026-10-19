import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { public: true } },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue'), meta: { public: true } },

  // 三个主 Tab
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { tab: true } },
  { path: '/square', name: 'Square', component: () => import('@/views/Square.vue'), meta: { tab: true } },
  { path: '/profile', name: 'Profile', component: () => import('@/views/Profile.vue'), meta: { tab: true } },

  // 二级页面
  { path: '/detail/:id', name: 'Detail', component: () => import('@/views/Detail.vue') },
  { path: '/friends', name: 'Friends', component: () => import('@/views/Friends.vue') },
  { path: '/likes', name: 'Likes', component: () => import('@/views/Likes.vue') },
  { path: '/works', name: 'Works', component: () => import('@/views/Works.vue') },
  { path: '/edit', name: 'EditProfile', component: () => import('@/views/EditProfile.vue') },
  { path: '/publish', name: 'Publish', component: () => import('@/views/Publish.vue') },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 登录守卫
router.beforeEach((to) => {
  if (!to.meta.public && !getToken()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
