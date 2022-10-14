import { asyncRoutes, constantRoutes } from '@/router'

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

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, menus) {
  // 首先，遍历所有的路由，选出name在rel里面的路由，其次，遍历路由下面的子路由，寻找在功能点列表里面的路由
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

const state = {
  permission: [],
  model: [],
  model_menu: {},
  model_url: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_PERMISSION_LIST: (state, permission) => {
    state.permission = permission
  },
  DEL_PERMISSION_LIST: state => {
    state.permission = []
  },
  SET_MODEL: (state, model) => {
    state.model = model
  },
  SET_MODEL_MENU: (state, model_menu) => {
    state.model_menu = model_menu
  },
  SET_MODEL_URL: (state, model_url) => {
    state.model_url = model_url
  }
}

const actions = {
  // 在这里同时生成菜单和路由，把路由返回，把菜单保存起来
  generateRoutes({ commit }, info) {
    return new Promise((resolve, reject) => {
      // 储存权限
      const permission = info.permission
      if (info.menu.length <= 0 || permission.length <= 0) {
        reject('权限获取失败，请重新登录')
      }
      // const res = []
      // permission.forEach(p => {
      //   res.push(p.action_key)
      // })
      commit('SET_PERMISSION_LIST', permission)
      // 储存模块和菜单
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
  deletePermission({ commit }) {
    commit('DEL_PERMISSION_LIST')
    commit('SET_MODEL')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
