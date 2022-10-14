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
    path: '/',
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
        component: () => import('@/views/home_page'),
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
  {
    path: '/admin/index/screen_index',
    component: Layout,
    menu_rel: 'admin/index/screen_index',
    children: [
      {
        path: '/admin/index/screen_index',
        component: () => import('@/views/home_page'),
        name: 'ScreenIndex',
        meta: { title: 'AI预警大屏' }
      }
    ]
  },
  // 信息总览
  {
    path: '/admin/index/index',
    component: Layout,
    menu_rel: 'admin/index/index',
    children: [
      {
        path: '/admin/index/index',
        component: () => import('@/views/admin/index'),
        name: 'Index',
        meta: { title: '信息总览' }
      }
    ]
  },
  // 告警管理
  {
    path: '/admin/alarm/unfinished',
    component: Layout,
    menu_rel: 'admin/alarm/unfinished',
    children: [
      {
        path: '/admin/alarm/unfinished',
        component: () => import('@/views/admin/alarm/unfinished'),
        name: 'Unfinished',
        meta: { title: '未处理事件' }
      }
    ]
  },
  {
    path: '/admin/alarm/completed',
    component: Layout,
    menu_rel: 'admin/alarm/completed',
    children: [
      {
        path: '/admin/alarm/completed',
        component: () => import('@/views/admin/alarm/completed'),
        name: 'Completed',
        meta: { title: '已处理事件' }
      }
    ]
  },
  {
    path: '/admin/alarm/personnel',
    component: Layout,
    menu_rel: 'admin/alarm/personnel',
    children: [
      {
        path: '/admin/alarm/personnel',
        component: () => import('@/views/admin/alarm/personnel'),
        name: 'Personnel',
        meta: { title: '出警人员库' }
      }
    ]
  },
  // 设备管理
  {
    path: '/admin/equipment/school_audio',
    component: Layout,
    menu_rel: 'admin/equipment/school_audio',
    children: [
      {
        path: '/admin/equipment/school_audio',
        component: () => import('@/views/admin/equipment/audio'),
        name: 'Audio',
        meta: { title: '智能音频设备' }
      }
    ]
  },
  {
    path: '/admin/equipment/school_camera',
    component: Layout,
    menu_rel: 'admin/equipment/school_camera',
    children: [
      {
        path: '/admin/equipment/school_camera',
        component: () => import('@/views/admin/equipment/camera'),
        name: 'Camera',
        meta: { title: '摄像头设备' }
      }
    ]
  },
  {
    path: '/admin/equipment/school_box',
    component: Layout,
    menu_rel: 'admin/equipment/school_box',
    children: [
      {
        path: '/admin/equipment/school_box',
        component: () => import('@/views/admin/equipment/box'),
        name: 'Box',
        meta: { title: 'AI BOX设备' }
      }
    ]
  },
  // 系统管理
  {
    path: '/admin/system/alarm_sound',
    component: Layout,
    menu_rel: 'admin/system/alarm_sound',
    children: [
      {
        path: '/admin/system/alarm_sound',
        component: () => import('@/views/admin/system/alarm_sound'),
        name: 'AlarmSound',
        meta: { title: '告警音管理' }
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
