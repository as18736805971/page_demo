import Layout from '@/layout'

const shibinRouter = [
  {
    path: '/inside_user',
    component: Layout,
    redirect: '/inside_user/index',
    menu_rel: 'inside_user',
    children: [
      {
        path: 'index',
        component: () => import('@/views/inside_user/index'),
        name: 'InsideUser',
        meta: { title: '内部用户管理' }
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    redirect: '/menu/index',
    menu_rel: 'menu',
    children: [
      {
        path: 'index',
        component: () => import('@/views/menu/index'),
        name: 'Menu',
        meta: { title: '菜单管理' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/index',
    menu_rel: 'role',
    children: [
      {
        path: 'index',
        component: () => import('@/views/role/index'),
        name: 'Role',
        meta: { title: '角色管理' }
      }
    ]
  }
]

export default shibinRouter
