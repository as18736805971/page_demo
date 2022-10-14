import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'
import router from '@/router'

let loadingInstance = null
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (!config.hasOwnProperty('showLoading') || config.showLoading === true) {
      loadingInstance = Loading.service({})
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.transformRequest = [function(data) {
      data['app_id'] = getAppId()
      data['timestamp'] = nowTime()
      data['token'] = getToken()
      data['sign'] = getSign(data)
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substr(0, ret.length - 1)
      return ret
    }]
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 300) {
        const u = navigator.userAgent
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          login.backToLogin()
        } else {
          // to re-login
          // MessageBox.confirm('登陆信息已过期，请重新登录。', '重新登陆', {
          //   confirmButtonText: '确定',
          //   type: 'warning'
          // }).then(() => {
          //   store.dispatch('user/resetToken').then(() => {
          //     if (localStorage.getItem('loginPage')) {
          //       router.push(`${localStorage.getItem('loginPage')}/login`)
          //     } else {
          //       router.push(`/admin/login`)
          //     }
          //   })
          // })
          localStorage.removeItem('scl_name')
          store.dispatch('user/resetToken').then(() => {
            if (localStorage.getItem('loginPage')) {
              router.push(`${localStorage.getItem('loginPage')}/login`)
            } else {
              router.push(`/admin/login`)
            }
          })
          return Promise.reject()
        }
      } else {
        Message({
          message: res.message || '请求错误，请稍后再试',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    loadingInstance.close()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
