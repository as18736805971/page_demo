import store from './store'
import router from './router'
import { resetRouter } from './router'
import { Message } from 'element-ui'
import { setEncrypt } from '@/utils'
import { getToken, removeToken } from '@/utils/auth'
import { getUserInfo, authWeb } from '@/api/login'

/**
 * 白名单path
 * @type {string[]}
 */
const whiteList = ['/login', '/demo', '/role', '/404']

router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  next()
  // const hasToken = getToken()
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     next({ path: '/app' })
  //   } else {
  //     const per = store.state.permission
  //     const hasPermission = per.model && per.model.length > 0
  //     if (hasPermission) {
  //       if (localStorage.getItem('role_user')) {
  //         next()
  //       } else {
  //         Message({ message: '当前用户登录信息失效！', type: 'error' })
  //         await store.dispatch('user/resetToken')
  //         next(`/login`)
  //       }
  //     } else {
  //       try {
  //         const info = await authWeb().then((res) => {
  //           getUserInfo().then((us) => {
  //             localStorage.setItem('role_user', setEncrypt(JSON.stringify((us.data))))
  //             store.dispatch('user/setUser', us.data)
  //           })
  //           return res.data
  //         })
  //         if (info.menu.length === 0) {
  //           document.title = import.meta.env.VITE_APP_NAME
  //           Message({ message: '当前登录账号未被分配菜单导航，请联系管理人员！', type: 'error' })
  //           removeToken()
  //           next('/login')
  //         } else {
  //           resetRouter()
  //           const accessRoutes = await store.dispatch('permission/setPermission', info)
  //           accessRoutes.forEach((route) => {
  //             router.addRoute(route)
  //           })
  //           next({ ...to, replace: true })
  //         }
  //       } catch (error) {
  //         await store.dispatch('user/resetToken')
  //         next('/login')
  //       }
  //     }
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next(`/login`)
  //   }
  // }
})

router.afterEach(() => {})

/**
 * 设置网站名称
 * @param pageTitle
 * @returns {string}
 */
function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${import.meta.env.VITE_APP_NAME}`
  }
  return `${import.meta.env.VITE_APP_NAME}`
}
