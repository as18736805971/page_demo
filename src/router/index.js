import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: HomeView,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/image',
    component: () => import('@/views/image'),
    meta: {
      title: '压缩图片'
    }
  },
  {
    path: '/demo',
    component: () => import('@/views/demo/demo7'),
    meta: {
      title: '测试'
    }
  },
  {
    path: '/demo1',
    component: () => import('@/views/demo/demo8'),
    meta: {
      title: '测试'
    }
  },
  {
    path: '/demo2',
    component: () => import('@/views/demo/demo10'),
    meta: {
      title: '测试'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
