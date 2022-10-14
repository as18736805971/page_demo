import { asyncRoutes, constantRoutes } from '@/router'

function getLeafMenu(menus, res = []) {
  menus.forEach(menu => {
    const tmp = { ...menu }
    if (tmp.child.length === 0) {
      res.push(tmp.menu_rel)
    } else {
      getLeafMenu(tmp.child, res)
    }
  })
  return res
}

function filterSubRouters(routes) {
  if (routes.children) {
    routes.children = filterSubRouters(routes.children)
  }
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.meta.hasOwnProperty('fpCode')) {
      const fpCode = route.meta.fpCode
      if (!state.functionList.includes(fpCode)) {
        return true
      } else {
        res.push(tmp)
      }
    } else {
      res.push(tmp)
    }
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
      if (tmp.children) {
        tmp.children = filterSubRouters(tmp.children)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menus: [],
  functionList: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_FUNCTION_LIST: (state, functionList) => {
    state.functionList = functionList
  },
  DEL_FUNCTION_LIST: state => {
    state.functionList = []
  }
}

const actions = {
  // 在这里同时生成菜单和路由，把路由返回，把菜单保存起来
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const menu_rels = getLeafMenu(menus)
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menu_rels)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_MENUS', menus)
      commit('SET_ROUTES', constantRoutes.concat(accessedRoutes))
      resolve(accessedRoutes)
    })
  },
  setFunctionList({ commit }, functionList) {
    const res = []
    functionList.forEach(fun => {
      res.push(fun.fp_code)
    })
    commit('SET_FUNCTION_LIST', res)
  },
  deleteFunctionList({ commit }) {
    commit('DEL_FUNCTION_LIST')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
