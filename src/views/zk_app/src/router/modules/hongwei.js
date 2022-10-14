import Layout from '@/layout'

const hongweiRouter = [
  {
    path: '/login/edu',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login/sch',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/interface_manage',
    component: Layout,
    redirect: '/interface_manage/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/interface_manage/list'),
        name: 'Interface',
        meta: { title: '接口管理' }
      }
    ]
  },
  {
    path: '/authority_mansge',
    component: Layout,
    redirect: '/authority_mansge/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/authority_mansge/list'),
        name: 'authority',
        meta: { title: '权限管理' }
      }
    ]
  },
  {
    path: '/timing_task',
    component: Layout,
    redirect: '/timing_task/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/timing_task/list'),
        name: 'TimingTask',
        meta: { title: '定时任务管理' }
      }
    ]
  },
  {
    path: '/bureau',
    component: Layout,
    redirect: '/bureau/info',
    children: [
      {
        path: 'info',
        component: () => import('@/views/bureau/info'),
        name: 'bureauInfo',
        meta: { title: '教育局信息管理' }
      },
      {
        path: 'user',
        component: () => import('@/views/bureau/user'),
        name: 'bureauUser',
        meta: { title: '教育局用户管理' }
      }
    ]
  },
  {
    path: '/risk_point',
    component: Layout,
    redirect: '/risk_point/index',
    children: [
      {
        path: 'identify',
        component: () => import('@/views/risk_point/identify'),
        name: 'riskidentify',
        meta: { title: '风险点辨识' }
      },
      {
        path: 'estimate',
        component: () => import('@/views/risk_point/estimate'),
        name: 'riskestimate',
        meta: { title: '风险点评估' }
      },
      {
        path: 'control',
        component: () => import('@/views/risk_point/risk_control'),
        name: 'riskcontrol',
        meta: { title: '风险点管控' }
      }
    ]
  },
  {
    path: '/emergency',
    component: Layout,
    redirect: '/emergency/group',
    children: [
      {
        path: 'group',
        component: () => import('@/views/emergency/group'),
        name: 'group',
        meta: { title: '应急小组管理' }
      }
    ]
  },
  {
    path: '/hidden_danger',
    component: Layout,
    redirect: '/hidden_danger/government',
    children: [
      {
        path: 'government',
        component: () => import('@/views/hidden_danger/government'),
        name: 'government',
        meta: { title: '隐患治理' }
      }
    ]
  },
  {
    path: '/hidden_danger',
    component: Layout,
    redirect: '/hidden_danger/manageLedger',
    children: [
      {
        path: 'manageLedger',
        component: () => import('@/views/hidden_danger/manageLedger'),
        name: 'manageLedger',
        meta: { title: '隐患治理台账' }
      }
    ]
  },
  {
    path: '/hidden_danger',
    component: Layout,
    redirect: '/hidden_danger/patrolLedger',
    children: [
      {
        path: 'patrolLedger',
        component: () => import('@/views/hidden_danger/patrolLedger'),
        name: 'patrolLedger',
        meta: { title: '隐患排查台账' }
      }
    ]
  },
  {
    path: '/risk_point_template',
    component: Layout,
    redirect: '/risk_point_template/index',
    menu_rel: 'risktemplate',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_point/template'),
        name: 'risktemplate',
        meta: { title: '风险点模板' }
      }
    ]
  },
  {
    path: '/dangericon',
    component: Layout,
    redirect: '/dangericon/index',
    menu_rel: 'risktemplate',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_point/dangericon'),
        name: 'dangericon',
        meta: { title: '警示标志模板' }
      }
    ]
  }
]

export default hongweiRouter
