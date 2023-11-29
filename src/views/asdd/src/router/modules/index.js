import Layout from '@/layout/index.vue'

export const asyncRoutes = [
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
