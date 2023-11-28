import {removeToken, setToken} from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  user_info: {}
}

const mutations = {
  SET_USER: (state, val) => {
    state.user_info = val
    setToken(val.token, val.login_id)
  }
}

const actions = {
  setUser({ commit }, val) {
    commit('SET_USER', val)
  },
  logOut({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      // httpRequest('/api/login/logout/app').then((res) => {
      //   dispatch('permission/delPermission', null, { root: true })
      //   dispatch('tagsView/delAllViews', null, { root: true })
      //   sessionStorage.clear()
      //   removeToken()
      //   resetRouter()
      //   resolve(res)
      // })
    })
  },
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      removeToken()
      dispatch('permission/delPermission', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
