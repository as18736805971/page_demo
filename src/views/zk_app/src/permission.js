import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/admin/login', '/edu/login', '/sch/login', '/risk_notifycard', '/play_video', '/auth-redirect', '/app_jump', '/third_login', '/scl_news_detail', '/security_detail'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/admin/login' || to.path === '/edu/login' || to.path === '/sch/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // next()
      // NProgress.done()
      // 这里判断是否有功能点
      const hasFunctionList = store.getters.functionList && store.getters.functionList.length > 0
      if (hasFunctionList) {
        next()
      } else {
        try {
          // get user info
          const { menu } = await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', menu)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || '出错了')
          if (localStorage.getItem('loginPage')) {
            next(`${localStorage.getItem('loginPage')}/login?redirect=${to.path}`)
          } else {
            next(`/admin/login?redirect=${to.path}`)
          }
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (localStorage.getItem('loginPage')) {
        next(`${localStorage.getItem('loginPage')}/login?redirect=${to.path}`)
      } else {
        next(`/admin/login?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
