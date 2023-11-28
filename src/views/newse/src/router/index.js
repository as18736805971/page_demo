import Vue from 'vue'
import Layout from '@/layout/index.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const constantRoutes = [
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
    hidden: true,
    redirect: '/error_page'
  },
  {
    path: '/admin/home/index',
    menu_rel: 'admin/home/index',
    component: Layout,
    children: [
      {
        path: '/admin/home/index',
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
        component: () => import('@/views/platform/menu.vue'),
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
        component: () => import('@/views/platform/user.vue'),
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
        component: () => import('@/views/platform/role.vue'),
        meta: { title: '角色管理' }
      }
    ]
  }
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/admin/home/index',
  //   children: [
  //     {
  //       path: 'error_page',
  //       component: () => import('@/views/home/index.vue'),
  //       meta: { title: '默认页', affix: false }
  //     }
  //   ]
  // }
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
