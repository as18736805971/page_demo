export default [
  {
    path: '/admin/home/index',
    name: 'HomeIndex',
    // component: Layout,
    meta: { title: '首页' },
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/admin/platform/index',
    name: 'PlatformIndex',
    // component: Layout,
    meta: { title: '基础信息' }
    // component: () => import('@/views/platform')
  }
]
