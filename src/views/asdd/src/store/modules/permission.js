import { constantRoutes } from '@/router'
import { asyncRoutes } from '@/router/modules'

const state = {
  page_home: {},
  model: [
    {
      menu_id: 'bfaaf6342439f2c7c8215d13afc',
      menu_name: '首页',
      menu_url: 'admin/home/index',
      menu_target: 'self',
      menu_icon: 'index',
      menu_type: 1,
      menu_order: 1,
      menu_pid: '0',
      child_menu: []
    },
    {
      menu_id: 'bfaaf6bc086342439f2c7c8215d13afc',
      menu_name: '智慧教务',
      menu_url: '',
      menu_target: 'self',
      menu_icon: 'sys',
      menu_type: 1,
      menu_order: 1,
      menu_pid: '0',
      child_menu: [
        {
          menu_id: 'ac3963ce98e14f53b7dd9a736adb4628',
          menu_name: '基础教务',
          menu_url: '',
          menu_target: 'self',
          menu_icon: 'menu',
          menu_order: 1,
          menu_type: 1,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: [
            {
              menu_id: '2e719b9822fb4b6d911fd94760a5de63',
              menu_name: '角色管理',
              menu_url: 'admin/platform/role',
              menu_target: 'self',
              menu_icon: 'role',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            },
            {
              menu_id: 'a1c85a34c02e4646bc0fa80018832991',
              menu_name: '年级管理',
              menu_url: 'admin/sys/dept',
              menu_target: 'self',
              menu_icon: 'dept',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            },
            {
              menu_id: '31ddbc6cb17347a5a9d30ef9d3e588b6',
              menu_name: '班级管理',
              menu_url: 'admin/sys/user',
              menu_target: 'self',
              menu_icon: 'user',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            }
          ]
        },
        {
          menu_id: 'ac3963ce98e14f53b7dd9a736adb4628',
          menu_name: '迎新管理',
          menu_url: '',
          menu_target: 'self',
          menu_icon: 'menu',
          menu_order: 1,
          menu_type: 1,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: [
            {
              menu_id: '2e719b9822fb4b6d911fd94760a5de63',
              menu_name: '教师信息采集',
              menu_url: 'admin/platform/menu',
              menu_target: 'self',
              menu_icon: 'role',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            },
            {
              menu_id: 'a1c85a34c02e4646bc0fa80018832991',
              menu_name: '学生信息采集',
              menu_url: 'admin/sys/dept',
              menu_target: 'self',
              menu_icon: 'dept',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            }
          ]
        }
      ]
    },
    {
      menu_id: 'bfaaf6bc086342439f2c7c8215d13afc',
      menu_name: '平台管理',
      menu_url: '',
      menu_target: 'self',
      menu_icon: 'sys',
      menu_order: 1,
      menu_type: 1,
      menu_pid: '0',
      child_menu: [
        {
          menu_id: 'ac3963ce98e14f53b7dd9a736adb4628',
          menu_name: '菜单管理',
          menu_url: 'admin/platform/menu',
          menu_target: 'self',
          menu_icon: 'menu',
          menu_order: 1,
          menu_type: 2,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: []
        },
        {
          menu_id: '2e719b9822fb4b6d911fd94760a5de63',
          menu_name: '角色管理',
          menu_url: 'admin/platform/role',
          menu_target: 'self',
          menu_icon: 'role',
          menu_order: 1,
          menu_type: 2,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: []
        },
        {
          menu_id: '31ddbc6cb17347a5a9d30ef9d3e588b6',
          menu_name: '用户管理',
          menu_url: 'admin/platform/user',
          menu_target: 'self',
          menu_icon: 'user',
          menu_order: 1,
          menu_type: 2,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: []
        }
      ]
    }
  ],
  model_url: [],
  model_menu: {},
  crumbs_list: [],
  permission: []
}

const mutations = {
  SET_PAGE_HOME: (state, page_home) => {
    state.page_home = page_home
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_MODEL: (state, model) => {
    state.model = model
  },
  SET_MODEL_URL: (state, model_url) => {
    state.model_url = model_url
  },
  SET_MODEL_MENU: (state, model_menu) => {
    state.model_menu = model_menu
  },
  SET_PERMISSION(state, val) {
    state.permission = val
  },
  DEL_PERMISSION: state => {
    state.permission = []
  },
  SET_CRUMBS_LIST: (state, crumbs) => {
    state.crumbs_list = crumbs
  }
}

const actions = {
  setPageHome({commit}, home) {
    commit('SET_PAGE_HOME', home)
  },
  setCrumbsList({commit}, crumbs) {
    commit('SET_CRUMBS_LIST', crumbs)
  },
  setPermission({ commit }, info) {
    return new Promise((resolve, reject) => {
      const permission = info.permission
      if (info.menu.length <= 0 || permission.length <= 0) {
        reject('权限获取失败，请重新登录')
      }
      commit('SET_PERMISSION', permission)
      const model = info.menu
      const model_menu = {}
      const model_data = []
      const model_url_data = []
      const menus = []
      model.forEach(item => {
        if (item.child_menu.length > 0) {
          model_url_data[item.menu_id] = []
          model_menu[item.menu_id] = item.child_menu
          const res = getLeafMenu(item.child_menu)
          model_url_data[item.menu_id].push(...res)
          for (const i in item.child_menu) {
            menus.push(item.child_menu[i])
          }
        } else {
          if (item.menu_url) {
            model_url_data[item.menu_id] = []
            const res = getLeafMenu([item])
            model_url_data[item.menu_id].push(...res)
            menus.push(item)
          }
        }
        const tmp = item
        model_data.push(tmp)
      })
      commit('SET_MODEL', model_data)
      commit('SET_MODEL_MENU', model_menu)
      commit('SET_MODEL_URL', model_url_data)
      const menu_rels = getLeafMenu(menus)
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menu_rels)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', constantRoutes.concat(accessedRoutes))
      resolve(accessedRoutes)
    })
  },
  delPermission({ commit }) {
    commit('DEL_PERMISSION')
    commit('SET_MODEL')
  }
}

function getLeafMenu(menus, res = []) {
  menus.forEach(menu => {
    const tmp = { ...menu }
    if (tmp.child_menu.length === 0) {
      if (tmp.menu_url) {
        res.push(tmp.menu_url)
      }
    } else {
      getLeafMenu(tmp.child_menu, res)
    }
  })
  return res
}

function filterSubRouters(routes) {
  if (routes.child_menu) {
    routes.child_menu = filterSubRouters(routes.child_menu)
  }
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    res.push(tmp)
  })
  return res
}

export function filterAsyncRoutes(routes, menus) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (menus.includes(tmp.menu_rel)) {
      if (tmp.child_menu) {
        tmp.child_menu = filterSubRouters(tmp.child_menu)
      }
      res.push(tmp)
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
