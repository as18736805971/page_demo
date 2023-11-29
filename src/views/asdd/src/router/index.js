import Vue from 'vue'
import Layout from '@/layout/index.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/role',
    name: 'Role',
    hidden: true,
    component: () => import('@/views/login/roles.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/demo/index.vue')
  },
  {
    path: '/404',
    name: '404',
    hidden: true
    // redirect: '/error_page'
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/login/redirect.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/home/index',
    children: [
      {
        path: 'error_page',
        component: () => import('@/views/login/error.vue'),
        meta: { title: '默认页', affix: false }
      }
    ]
  },
  {
    path: '/admin/home/index',
    menu_rel: 'admin/home/index',
    component: Layout,
    children: [
      {
        path: '/admin/home/index',
        name: 'HomeIndex',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/admin/platform/menu',
    menu_rel: 'admin/platform/menu',
    component: Layout,
    children: [
      {
        path: '/admin/platform/menu',
        name: 'PlatformMenu',
        component: () => import('@/views/platform/menu/index.vue'),
        meta: { title: '菜单管理' }
      }
    ]
  },
  {
    path: '/admin/platform/user',
    menu_rel: 'admin/platform/user',
    component: Layout,
    children: [
      {
        path: '/admin/platform/user',
        name: 'PlatformUser',
        component: () => import('@/views/platform/user/index.vue'),
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/admin/platform/role',
    menu_rel: 'admin/platform/role',
    component: Layout,
    children: [
      {
        path: '/admin/platform/role',
        name: 'PlatformRole',
        component: () => import('@/views/platform/role/index.vue'),
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/admin/platform/dept',
    menu_rel: 'admin/platform/dept',
    component: Layout,
    children: [
      {
        path: '/admin/platform/dept',
        name: 'PlatformDept',
        component: () => import('@/views/platform/dept/index.vue'),
        meta: { title: '部门管理' }
      }
    ]
  },
  {
    path: '/admin/platform/apply',
    menu_rel: 'admin/platform/apply',
    component: Layout,
    children: [
      {
        path: '/admin/platform/apply',
        name: 'PlatformApply',
        component: () => import('@/views/platform/apply/index.vue'),
        meta: { title: '应用管理' }
      }
    ]
  }
]
const createRouter = () => {
  return new VueRouter({
    mode: 'hash',
    routes: constantRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 }
    }
  })
}
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
