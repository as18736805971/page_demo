import store from './store'
import router from './router'
import { resetRouter } from './router'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

/**
 * 白名单path
 * @type {string[]}
 */
const whiteList = ['/login', '/demo', '/role', '/404']

router.beforeEach(async(to, from, next) => {
  // document.title = getPageTitle(to.meta.title)
  // const hasToken = getToken()
  // if (hasToken) {
  //   const per = store.state.permission
  //   const hasPermission = per.model && per.model.length > 0
  //   if (hasPermission) {
  //
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next(`/login`)
  //   }
  // }
  next()
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
