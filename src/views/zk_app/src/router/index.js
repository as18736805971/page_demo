import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import shibinRouter from '@/router/modules/shibin'
// import hongweiRouter from '@/router/modules/hongwei'
// import zhangheqinRouter from '@/router/modules/zhangheqin'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

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
    path: '/edu/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/sch/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/admin/login',
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
    path: '/doc/risk',
    component: () => import('@/views/doc/risk'),
    hidden: true
  },
  {
    path: '/app_jump',
    component: () => import('@/views/app_jump/index'),
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
        component: () => import('@/views/home_page/index'),
        name: 'Homepage',
        meta: { title: '首页', icon: 'dashboard', affix: false }
      }
    ]
  },
  {
    path: '/risk_notifycard',
    component: () => import('@/views/risk_notifycard/index'),
    hidden: true
  },
  {
    path: '/play_video',
    component: () => import('@/views/risk_notifycard/play_video'),
    hidden: true
  },
  {
    path: '/third_login',
    component: () => import('@/views/login/third_login'),
    hidden: true
  },
  {
    path: '/scl_news_detail',
    component: () => import('@/views/external_links/news'),
    hidden: true
  },
  {
    path: '/security_detail',
    component: () => import('@/views/external_links/knowledge'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/device_manage',
    component: Layout,
    redirect: '/device_manage/index',
    menu_rel: 'device',
    children: [
      {
        path: 'index',
        component: () => import('@/views/device_manage/index'),
        name: 'device',
        meta: { title: '设备管理' }
      }
    ]
  },
  {
    path: '/file_libray',
    component: Layout,
    redirect: '/file_libray/index',
    menu_rel: 'fileLibray',
    children: [
      {
        path: 'index',
        component: () => import('@/views/file_libray/index'),
        name: 'fileLibray',
        meta: { title: '校园文件库' }
      }
    ]
  },
  {
    path: '/eduBigScreen',
    component: () => import('@/views/eduBigScreen/index'),
    menu_rel: 'eduBigScreen',
    hidden: true
  },
  {
    path: '/schBigScreen',
    component: () => import('@/views/schBigScreen/index'),
    menu_rel: 'schBigScreen',
    hidden: true
  },
  {
    path: '/interface_manage',
    component: Layout,
    redirect: '/interface_manage/list',
    menu_rel: 'interface',
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
    menu_rel: 'authority',
    children: [
      {
        path: 'list',
        component: () => import('@/views/authority_manage/list'),
        name: 'Authority',
        meta: { title: '权限管理' }
      }
    ]
  },
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
  },
  {
    path: '/app_key',
    component: Layout,
    redirect: '/app_key/index',
    menu_rel: 'app_key',
    children: [
      {
        path: 'index',
        component: () => import('@/views/app_key/index'),
        name: 'AppKey',
        meta: { title: '应用管理' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    redirect: '/dict/index',
    menu_rel: 'dict',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dict/index'),
        name: 'Dict',
        meta: { title: '字典管理' }
      }
    ]
  },
  {
    path: '/school_user',
    component: Layout,
    redirect: '/school_user/index',
    menu_rel: 'school_user',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_user/index'),
        name: 'SchoolUser',
        meta: { title: '学校用户管理' }
      }
    ]
  },
  {
    path: '/school_dept',
    component: Layout,
    redirect: '/school_dept/index',
    menu_rel: 'school_dept',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_dept/index'),
        name: 'SchoolDept',
        meta: { title: '学校部门管理' }
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    redirect: '/school/index',
    menu_rel: 'school',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school/index'),
        name: 'School',
        meta: { title: '学校管理' }
      }
    ]
  },
  {
    path: '/bureau_user',
    component: Layout,
    redirect: '/bureau_user/index',
    menu_rel: 'bureau_user',
    children: [
      {
        path: 'index',
        component: () => import('@/views/bureau/user'),
        name: 'BureauUser',
        meta: { title: '教育局用户管理' }
      }
    ]
  },
  {
    path: '/bureau',
    component: Layout,
    redirect: '/bureau/index',
    menu_rel: 'bureau',
    children: [
      {
        path: 'index',
        component: () => import('@/views/bureau/info'),
        name: 'BureauInfo',
        meta: { title: '教育局管理' }
      }
    ]
  },
  {
    path: '/risk_point_identify',
    component: Layout,
    redirect: '/risk_point_identify/index',
    menu_rel: 'riskidentify',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_point/identify'),
        name: 'Riskidentify',
        meta: { title: '风险点辨识' }
      }
    ]
  },
  {
    path: '/risk_point_estimate',
    component: Layout,
    redirect: '/risk_point_estimate/index',
    menu_rel: 'riskestimate',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_point/estimate'),
        name: 'Riskestimate',
        meta: { title: '风险点评估' }
      }
    ]
  },
  {
    path: '/risk_point_control',
    component: Layout,
    redirect: '/risk_point_control/index',
    menu_rel: 'riskcontrol',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_point/risk_control'),
        name: 'Riskcontrol',
        meta: { title: '风险点管控' }
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
        name: 'Risktemplate',
        meta: { title: '风险点模板' }
      }
    ]
  },
  {
    path: '/danger_icon',
    component: Layout,
    redirect: '/danger_icon/index',
    menu_rel: 'DangerIcon',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_point/dangericon'),
        name: 'Dangericon',
        meta: { title: '警示标志模板' }
      }
    ]
  },
  {
    path: '/building',
    component: Layout,
    redirect: '/building/index',
    menu_rel: 'Building',
    children: [
      {
        path: 'index',
        component: () => import('@/views/building/index'),
        name: 'Building',
        meta: { title: '建筑物管理' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/index',
    menu_rel: 'Activity',
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/index'),
        name: 'Activity',
        meta: { title: '教学活动管理' }
      }
    ]
  },
  {
    path: '/risk_list',
    component: Layout,
    redirect: '/risk_list/index',
    menu_rel: 'RiskList',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_list/index'),
        name: 'RiskList',
        meta: { title: '风险清单' }
      }
    ]
  },
  {
    path: '/risk_map',
    component: Layout,
    redirect: '/risk_map/index',
    menu_rel: 'RiskMap',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_map/index'),
        name: 'RiskMap',
        meta: { title: '风险四色图' }
      }
    ]
  },
  {
    path: '/emergency',
    component: Layout,
    redirect: '/emergency/index',
    menu_rel: 'Plan',
    children: [
      {
        path: 'index',
        component: () => import('@/views/plan/index'),
        name: 'Plan',
        meta: { title: '应急预案管理' }
      }
    ]
  },
  {
    path: '/emergency_equip',
    component: Layout,
    redirect: '/emergency_equip/index',
    menu_rel: 'Equip',
    children: [
      {
        path: 'index',
        component: () => import('@/views/equip/index'),
        name: 'Equip',
        meta: { title: '应急设备管理' }
      }
    ]
  },
  {
    path: '/emergency_group',
    component: Layout,
    redirect: '/emergency_group/index',
    menu_rel: 'group',
    children: [
      {
        path: 'index',
        component: () => import('@/views/emergency/group'),
        name: 'Group',
        meta: { title: '应急小组管理' }
      }
    ]
  },
  {
    path: '/patrol',
    component: Layout,
    redirect: '/patrol/index',
    menu_rel: 'Patrol',
    children: [
      {
        path: 'index',
        component: () => import('@/views/patrol/index'),
        name: 'Patrol',
        meta: { title: '隐患排查管理' }
      }
    ]
  },
  {
    path: '/investigationStatistics',
    component: Layout,
    redirect: '/investigationStatistics/index',
    menu_rel: 'InvestigationStatistics',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/investigationStatistics'),
        name: 'InvestigationStatistics',
        meta: { title: '排查统计' }
      }
    ]
  },
  {
    path: '/hidden_danger',
    component: Layout,
    redirect: '/hidden_danger/index',
    menu_rel: 'handle',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/government'),
        name: 'Government',
        meta: { title: '隐患治理' }
      }
    ]
  },
  {
    path: '/manage_ledger',
    component: Layout,
    redirect: '/manage_ledger/index',
    menu_rel: 'ManageLedger',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/manageLedger'),
        name: 'ManageLedger',
        meta: { title: '隐患治理台账' }
      }
    ]
  },
  {
    path: '/patro_ledger',
    component: Layout,
    redirect: '/patro_ledger/index',
    menu_rel: 'PatroLedger',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/patrolLedger'),
        name: 'PatrolLedger',
        meta: { title: '隐患排查台账' }
      }
    ]
  },
  {
    path: '/manage_type',
    component: Layout,
    redirect: '/manage_type/index',
    menu_rel: 'ManageType',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/manageType'),
        name: 'ManageType',
        meta: { title: '隐患类型管理' }
      }
    ]
  },
  {
    path: '/schPatrolSummary',
    component: Layout,
    redirect: '/schPatrolSummary/index',
    menu_rel: 'SchPatrolSummary',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/schPatrolSummary'),
        name: 'SchPatrolSummary',
        meta: { title: '隐患巡检汇总' }
      }
    ]
  },
  {
    path: '/eduPatrolSummary',
    component: Layout,
    redirect: '/eduPatrolSummary/index',
    menu_rel: 'EduPatrolSummary',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hidden_danger/eduPatrolSummary'),
        name: 'EduPatrolSummary',
        meta: { title: '隐患巡检汇总' }
      }
    ]
  },
  {
    path: '/special',
    component: Layout,
    redirect: '/special/index',
    menu_rel: 'SpecialInfo',
    children: [
      {
        path: 'index',
        component: () => import('@/views/special/index'),
        name: 'SpecialInfo',
        meta: { title: '专项检查管理' }
      }
    ]
  },
  {
    path: '/special_score',
    component: Layout,
    redirect: '/special_score/index',
    menu_rel: 'SpecialScore',
    children: [
      {
        path: 'index',
        component: () => import('@/views/special/score'),
        name: 'SpecialScore',
        meta: { title: '专项检查评分' }
      }
    ]
  },
  {
    path: '/special_handle',
    component: Layout,
    redirect: '/special_handle/index',
    menu_rel: 'SpecialHandle',
    children: [
      {
        path: 'index',
        component: () => import('@/views/special/handle'),
        name: 'SpecialHandle',
        meta: { title: '专项检查处理' }
      }
    ]
  },
  {
    path: '/special_result',
    component: Layout,
    redirect: '/special_result/index',
    menu_rel: 'SpecialResult',
    children: [
      {
        path: 'index',
        component: () => import('@/views/special/result'),
        name: 'SpecialResult',
        meta: { title: '结果分析' }
      }
    ]
  },
  {
    path: '/emergency_model',
    component: Layout,
    redirect: '/emergency_model/index',
    menu_rel: 'EmergencyModel',
    children: [
      {
        path: 'index',
        component: () => import('@/views/plan/model'),
        name: 'EmergencyModel',
        meta: { title: '应急预案模板管理' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/index',
    menu_rel: 'Article',
    children: [
      {
        path: 'index',
        component: () => import('@/views/article/index'),
        name: 'Article',
        meta: { title: '安全文章' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    redirect: '/job/index',
    menu_rel: 'Job',
    children: [
      {
        path: 'index',
        component: () => import('@/views/job/index'),
        name: 'Job',
        meta: { title: '岗位信息管理' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    menu_rel: 'Notice',
    children: [
      {
        path: 'index',
        component: () => import('@/views/notice/index'),
        name: 'Notice',
        meta: { title: '通知管理' }
      }
    ]
  },
  {
    path: '/app_config',
    component: Layout,
    redirect: '/app_config/index',
    menu_rel: 'AppConfig',
    children: [
      {
        path: 'index',
        component: () => import('@/views/app_config/index'),
        name: 'AppConfig',
        meta: { title: 'APP权限配置' }
      }
    ]
  },
  {
    path: '/pajx',
    hidden: true,
    menu_rel: 'PAJX',
    component: () => import('@/views/pajx/index')
  },
  {
    path: '/pajx_att',
    component: Layout,
    redirect: '/pajx_att/index',
    menu_rel: 'PAJXAtt',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pajx_att/index'),
        name: 'PAJXAtt',
        meta: { title: '考勤管理' }
      }
    ]
  },
  {
    path: '/facilities_manage',
    component: Layout,
    redirect: '/facilities_manage/index',
    menu_rel: 'facilities',
    children: [
      {
        path: 'index',
        component: () => import('@/views/facilities_manage/index'),
        name: 'Facilities',
        meta: { title: '设施管理' }
      }
    ]
  },
  {
    path: '/risk_import',
    component: Layout,
    redirect: '/risk_import/index',
    menu_rel: 'riskImport',
    children: [
      {
        path: 'index',
        component: () => import('@/views/risk_import/index'),
        name: 'RiskImport',
        meta: { title: '风险点导入' }
      }
    ]
  },
  {
    path: '/dormitory_attendance',
    component: Layout,
    redirect: '/dormitory_attendance/index',
    menu_rel: 'dormitory_attendance',
    children: [
      {
        path: 'index',
        component: () => import('@/views/campus_attendance/dormitory'),
        name: 'DormitoryAttendance',
        meta: { title: '宿舍考勤' }
      }
    ]
  },
  {
    path: '/school_attendance',
    component: Layout,
    redirect: '/school_attendance/index',
    menu_rel: 'school_attendance',
    children: [
      {
        path: 'index',
        component: () => import('@/views/campus_attendance/school'),
        name: 'SchoolAttendance',
        meta: { title: '校门考勤' }
      }
    ]
  },
  {
    path: '/equip_audio',
    component: Layout,
    redirect: '/equip_audio/index',
    menu_rel: 'equip_audio',
    children: [
      {
        path: 'index',
        component: () => import('@/views/device_manage/audio'),
        name: 'EquipAudio',
        meta: { title: '广播管理' }
      }
    ]
  },
  {
    path: '/equip_camera',
    component: Layout,
    redirect: '/equip_camera/index',
    menu_rel: 'equip_camera',
    children: [
      {
        path: 'index',
        component: () => import('@/views/device_manage/camera'),
        name: 'EquipCamera',
        meta: { title: '摄像头管理' }
      }
    ]
  },
  {
    path: '/equip_visitor',
    component: Layout,
    redirect: '/equip_visitor/index',
    menu_rel: 'equip_visitor',
    children: [
      {
        path: 'index',
        component: () => import('@/views/device_manage/visitor'),
        name: 'EquipVisitor',
        meta: { title: '访客管理' }
      }
    ]
  },
  {
    path: '/scl_camera',
    component: Layout,
    redirect: '/scl_camera/index',
    menu_rel: 'scl_camera',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_camera/index'),
        name: 'SchoolCamera',
        meta: { title: '校园监控' }
      }
    ]
  },
  {
    path: '/monitore_association',
    component: Layout,
    redirect: '/monitore_association/index',
    menu_rel: 'monitore_association',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_camera/monitore_association'),
        name: 'MonitoreAssociation',
        meta: { title: '监控关联' }
      }
    ]
  },
  {
    path: '/patrol_import',
    component: Layout,
    redirect: '/patrol_import/index',
    menu_rel: 'patrolImport',
    children: [
      {
        path: 'index',
        component: () => import('@/views/patrol/import'),
        name: 'patrolImport',
        meta: { title: '巡查计划导入' }
      }
    ]
  },
  {
    path: '/timing_task',
    component: Layout,
    redirect: '/timing_task/index',
    menu_rel: 'timingTask',
    children: [
      {
        path: 'index',
        component: () => import('@/views/timing_task/list'),
        name: 'timingTask',
        meta: { title: '定时任务管理' }
      }
    ]
  },
  {
    path: '/exam_bank',
    component: Layout,
    redirect: '/exam_bank/index',
    menu_rel: 'exam_bank',
    children: [
      {
        path: 'index',
        component: () => import('@/views/online_exam/exam_bank'),
        name: 'ExamBank',
        meta: { title: '题库管理' }
      }
    ]
  },
  {
    path: '/exam_record',
    component: Layout,
    redirect: '/exam_record/index',
    menu_rel: 'exam_record',
    children: [
      {
        path: 'index',
        component: () => import('@/views/online_exam/exam_record'),
        name: 'ExamRecord',
        meta: { title: '考试记录' }
      }
    ]
  },
  {
    path: '/bureau_safety',
    component: Layout,
    redirect: '/bureau_safety/index',
    menu_rel: 'bureau_safety',
    children: [
      {
        path: 'index',
        component: () => import('@/views/bureau_safety/index'),
        name: 'BureauSafety',
        meta: { title: '安全事故管理' }
      }
    ]
  },
  {
    path: '/school_safety',
    component: Layout,
    redirect: '/school_safety/index',
    menu_rel: 'school_safety',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_safety/index'),
        name: 'SchoolSafety',
        meta: { title: '安全事故管理' }
      }
    ]
  },
  {
    path: '/scl_news',
    component: Layout,
    redirect: '/scl_news/index',
    menu_rel: 'sclNews',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_news/index'),
        name: 'sclNews',
        meta: { title: '校园新闻' }
      }
    ]
  },
  {
    path: '/scl_news_cate',
    component: Layout,
    redirect: '/scl_news_cate/index',
    menu_rel: 'sclNewsCate',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_news/category'),
        name: 'sclNewsCate',
        meta: { title: '新闻分类' }
      }
    ]
  },
  {
    path: '/scl_album',
    component: Layout,
    redirect: '/scl_album/index',
    menu_rel: 'sclAlbum',
    children: [
      {
        path: 'index',
        component: () => import('@/views/campus_album/index'),
        name: 'sclAlbum',
        meta: { title: '校园相册' }
      }
    ]
  },
  {
    path: '/scl_profile',
    component: Layout,
    redirect: '/scl_profile/index',
    menu_rel: 'sclProfile',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_news/profile'),
        name: 'sclProfile',
        meta: { title: '学校简介' }
      }
    ]
  },
  {
    path: '/scl_user_import',
    component: Layout,
    redirect: '/scl_user_import/index',
    menu_rel: 'SclUserImport',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_user/import'),
        name: 'SclUserImport',
        meta: { title: '用户导入' }
      }
    ]
  },
  {
    path: '/school_label',
    component: Layout,
    redirect: '/school_label/index',
    menu_rel: 'SchoolLabel',
    children: [
      {
        path: 'index',
        component: () => import('@/views/school_label/index'),
        name: 'SchoolLabel',
        meta: { title: '标记管理' }
      }
    ]
  },
  {
    path: '/module_manage',
    component: Layout,
    redirect: '/module_manage/index',
    menu_rel: 'module_manage',
    children: [
      {
        path: 'index',
        component: () => import('@/views/large_screen/module_manage'),
        name: 'ModuleManage',
        meta: { title: '模块管理' }
      }
    ]
  },
  {
    path: '/scl_module',
    component: Layout,
    redirect: '/scl_module/index',
    menu_rel: 'scl_module',
    children: [
      {
        path: 'index',
        component: () => import('@/views/large_screen/scl_module'),
        name: 'SclModule',
        meta: { title: '模块管理' }
      }
    ]
  },
  {
    path: '/patrol_statistics',
    component: Layout,
    redirect: '/patrol_statistics/index',
    menu_rel: 'patrolStatistics',
    children: [
      {
        path: 'index',
        component: () => import('@/views/patrol/statistics'),
        name: 'PatrolStatistics',
        meta: { title: '隐患排查完成率' }
      }
    ]
  },
  {
    path: '/equip_alarm',
    component: Layout,
    redirect: '/equip_alarm/index',
    menu_rel: 'equip_alarm',
    children: [
      {
        path: 'index',
        component: () => import('@/views/device_manage/alarm'),
        name: 'EquipAlarm',
        meta: { title: '一键报警管理' }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/index',
    menu_rel: 'material',
    children: [
      {
        path: 'index',
        component: () => import('@/views/material/index'),
        name: 'Material',
        meta: { title: '物料导出' }
      }
    ]
  },
  {
    path: '/scl_identify',
    component: Layout,
    redirect: '/scl_identify/index',
    menu_rel: 'scl_identify',
    children: [
      {
        path: 'index',
        component: () => import('@/views/scl_identify/index'),
        name: 'SclIdentify',
        meta: { title: '学校风险点' }
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
