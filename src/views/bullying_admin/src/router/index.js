import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/',
  //   component: () => import('@/views/app/index'),
  //   hidden: true
  // },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    redirect: '/home_page'
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/role',
    component: () => import('@/views/role/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home_page',
    menu_rel: 'homepage',
    children: [
      {
        path: 'home_page',
        component: () => import('@/views/error-page/index'),
        name: 'Homepage',
        meta: { title: '默认页', icon: 'dashboard', affix: false }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /* 系统管理 */
  {
    path: '/admin/sys/menu',
    component: Layout,
    menu_rel: 'admin/sys/menu',
    children: [
      {
        path: '/admin/sys/menu',
        component: () => import('@/views/admin/sys/menu'),
        name: 'SysMenu',
        meta: { title: '菜单管理' }
      }
    ]
  },
  {
    path: '/admin/sys/role',
    component: Layout,
    menu_rel: 'admin/sys/role',
    children: [
      {
        path: '/admin/sys/role',
        component: () => import('@/views/admin/sys/role'),
        name: 'SysRole',
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/admin/sys/dept',
    component: Layout,
    menu_rel: 'admin/sys/dept',
    children: [
      {
        path: '/admin/sys/dept',
        component: () => import('@/views/admin/sys/dept'),
        name: 'SysDept',
        meta: { title: '部门管理' }
      }
    ]
  },
  {
    path: '/admin/sys/user',
    component: Layout,
    menu_rel: 'admin/sys/user',
    children: [
      {
        path: '/admin/sys/user',
        component: () => import('@/views/admin/sys/user'),
        name: 'SysUser',
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/admin/sys/websocket',
    component: Layout,
    menu_rel: 'admin/sys/websocket',
    children: [
      {
        path: '/admin/sys/websocket',
        component: () => import('@/views/admin/sys/websocket'),
        name: 'WebSocket',
        meta: { title: 'Websocket管理' }
      }
    ]
  },
  {
    path: '/admin/sys/application',
    component: Layout,
    menu_rel: 'admin/sys/application',
    children: [
      {
        path: '/admin/sys/application',
        component: () => import('@/views/admin/sys/application'),
        name: 'Application',
        meta: { title: '应用管理' }
      }
    ]
  },
  {
    path: '/admin/sys/notice',
    component: Layout,
    menu_rel: 'admin/sys/notice',
    children: [
      {
        path: '/admin/sys/notice',
        component: () => import('@/views/admin/sys/notice'),
        name: 'Notice',
        meta: { title: '通知公告' }
      }
    ]
  },
  {
    path: '/admin/sys/dictionary',
    component: Layout,
    menu_rel: 'admin/sys/dictionary',
    children: [
      {
        path: '/admin/sys/dictionary',
        component: () => import('@/views/admin/sys/dictionary'),
        name: 'Dictionary',
        meta: { title: '字典管理' }
      }
    ]
  },
  {
    path: '/admin/sys/task',
    component: Layout,
    menu_rel: 'admin/sys/task',
    children: [
      {
        path: '/admin/sys/task',
        component: () => import('@/views/admin/sys/task'),
        name: 'Task',
        meta: { title: '定时任务' }
      }
    ]
  },
  /* 学校管理 */
  {
    path: '/admin/school/school',
    component: Layout,
    menu_rel: 'admin/school/school',
    children: [
      {
        path: '/admin/school/school',
        component: () => import('@/views/admin/school/school'),
        name: 'School',
        meta: { title: '学校管理' }
      }
    ]
  },
  /* 教育局 */
  {
    path: '/admin/education/index',
    component: Layout,
    menu_rel: 'admin/education/index',
    children: [
      {
        path: '/admin/education/index',
        component: () => import('@/views/admin/education'),
        name: 'Education',
        meta: { title: '教育局' }
      }
    ]
  },
  /* 设备管理 */
  {
    path: '/admin/equipment/camera',
    component: Layout,
    menu_rel: 'admin/equipment/camera',
    children: [
      {
        path: '/admin/equipment/camera',
        component: () => import('@/views/admin/equipment/camera'),
        name: 'Camera',
        meta: { title: '摄像头管理' }
      }
    ]
  },
  {
    path: '/admin/equipment/audio',
    component: Layout,
    menu_rel: 'admin/equipment/audio',
    children: [
      {
        path: '/admin/equipment/audio',
        component: () => import('@/views/admin/equipment/audio'),
        name: 'Audio',
        meta: { title: '音频设备管理' }
      }
    ]
  },
  {
    path: '/admin/equipment/smart',
    component: Layout,
    menu_rel: 'admin/equipment/smart',
    children: [
      {
        path: '/admin/equipment/smart',
        component: () => import('@/views/admin/equipment/smart'),
        name: 'Smart',
        meta: { title: '家人智能音频设备' }
      }
    ]
  },
  {
    path: '/admin/equipment/box',
    component: Layout,
    menu_rel: 'admin/equipment/box',
    children: [
      {
        path: '/admin/equipment/box',
        component: () => import('@/views/admin/equipment/box'),
        name: 'Box',
        meta: { title: '盒子设备' }
      }
    ]
  }
]

const createRouter = () => {
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    base: '/',
    routes: constantRoutes
  })
}

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
