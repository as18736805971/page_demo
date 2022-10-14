import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, httpRequest, decrypt } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/role'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/app' })
      NProgress.done()
    } else {
      // next()
      // NProgress.done()
      // 这里判断是否有功能点
      const hasPermission = store.getters.model && store.getters.model.length > 0
      if (hasPermission) {
        next()
      } else {
        try {
          // get user info
          const info = await httpRequest('/api/login/authWeb', {}, false).then(res => {
            httpRequest('/api/login/user/info', { }, false).then(res => {
              sessionStorage.setItem('login_role', res.data)
            })
            return JSON.parse(decrypt(res.data))
          })
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', info)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '出错了')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
