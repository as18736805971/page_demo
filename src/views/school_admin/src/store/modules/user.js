import { setToken, removeToken, httpRequest } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  title: ' ',
  logo: require('@/assets/images/college_logo.png'),
  logo_collapse: require('@/assets/images/logo_collapse.png')
}

const actions = {
  storeRoles({ commit }, roles) { },

  setRole({ commit }, role) {
    setToken(role.token)
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      httpRequest('/api/login/logout/app', {}).then(res => {
        dispatch('permission/deletePermission', null, { root: true })
        dispatch('tagsView/delAllViews', null, { root: true })
        sessionStorage.clear()
        removeToken()
        resetRouter()
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      removeToken()
      dispatch('permission/deletePermission', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  actions
}
