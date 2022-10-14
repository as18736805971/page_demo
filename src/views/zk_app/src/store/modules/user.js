import { loginInside, loginEdu, loginSch, getInfo, getAuth, uppwd, logout } from '@/api/user'
import { getToken, setToken, removeToken, encryptPassword, getRandomKey } from '@/utils/auth'
import { resetRouter } from '@/router'
import logo from '../../assets/images/logo.png'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  pubkey: '',
  name: '',
  orgName: '',
  phone: '',
  email: '',
  title: '系统管理端',
  logo: logo
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_PUBKEY: (state, pubkey) => {
    state.pubkey = pubkey
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ORGNAME: (state, org_name) => {
    state.orgName = org_name
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.avatar = email
  },
  SET_TITLE: (state, title) => {
    state.title = title
  },
  SET_LOGO: (state, logo) => {
    state.logo = logo
  },
  SET_IS_ADMIN: (state, is_admin) => {
    state.is_admin = is_admin
  },
  SET_USER_TYPE: (state, user_type) => {
    state.user_type = user_type
  }
}

const actions = {
  // 管理员登陆
  insideLogin({ commit }, userInfo) {
    const { account, password, captcha_val } = userInfo
    return new Promise((resolve, reject) => {
      const encrypted_info = encryptPassword(getRandomKey(), password, state.pubkey)
      loginInside({
        account: account.trim(),
        password: encrypted_info.aes_password,
        enaeskey: encrypted_info.key,
        captcha_val: captcha_val,
        captcha_key: sessionStorage.getItem('captcha_key')
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 教育局用户登录
  eduLogin({ commit }, userInfo) {
    const { account, password, captcha_val } = userInfo
    return new Promise((resolve, reject) => {
      const encrypted_info = encryptPassword(getRandomKey(), password, state.pubkey)
      loginEdu({
        account: account.trim(),
        password: encrypted_info.aes_password,
        enaeskey: encrypted_info.key,
        captcha_val: captcha_val,
        captcha_key: sessionStorage.getItem('captcha_key')
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 学校用户登录
  schLogin({ commit }, userInfo) {
    const { account, password, captcha_val } = userInfo
    return new Promise((resolve, reject) => {
      const encrypted_info = encryptPassword(getRandomKey(), password, state.pubkey)
      loginSch({
        account: account.trim(),
        password: encrypted_info.aes_password,
        enaeskey: encrypted_info.key,
        captcha_val: captcha_val,
        captcha_key: sessionStorage.getItem('captcha_key')
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 设置角色
  setRole({ commit }, res) {
    return new Promise((resolve, reject) => {
      const data = res
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      resolve()
    })
  },

  // 切换角色
  changeRole({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      dispatch('permission/deleteFunctionList', null, { root: true })
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // 界面内部修改密码
  changePasswd({ commit, dispatch }, userInfo) {
    const { old_password, new_password } = userInfo
    const old_info = encryptPassword(getRandomKey(), old_password, state.pubkey)
    const new_info = encryptPassword(getRandomKey(), new_password, state.pubkey)
    return new Promise((resolve, reject) => {
      uppwd(old_info.aes_password, new_info.aes_password, old_info.key, new_info.key).then(res => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        dispatch('permission/deleteFunctionList', null, { root: true })
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登陆')
        }
        // 给一些公共信息赋值
        commit('SET_NAME', data.user_name)
        commit('SET_ORGNAME', data.org_name)
        commit('SET_PHONE', data.user_phone)
        commit('SET_EMAIL', data.user_email)
        commit('SET_IS_ADMIN', data.admin_flag === '1')
        commit('SET_USER_TYPE', data.user_type)
        if (data.scl_log) {
          commit('SET_LOGO', data.scl_logo)
        }
        if (data.org_name) {
          commit('SET_TITLE', data.org_name)
        }
        getAuth(state.token).then(response => {
          const { data } = response
          const functionList = data.function_point
          if (!functionList || functionList.length <= 0) {
            Message({
              type: 'error',
              message: '权限获取失败，请重新登录!'
            })
            reject('权限获取失败，请重新登录')
            return false
          }
          if (!data.menu || data.menu.length <= 0) {
            Message({
              type: 'error',
              message: '菜单列表获取失败，请重新登录!'
            })
            reject('菜单列表获取失败，请重新登录')
            return false
          }
          dispatch('permission/setFunctionList', functionList, { root: true })
          resolve(data)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        dispatch('permission/deleteFunctionList', null, { root: true })
        dispatch('tagsView/delAllViews', null, { root: true })
        sessionStorage.removeItem('roles')
        localStorage.removeItem('loginPage')
        localStorage.removeItem('sidebarStatus')
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      dispatch('permission/deleteFunctionList', null, { root: true })
      removeToken()
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
