import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
// import store from '@/store'
import { getAppId, getBaseURL, removeToken } from '@/utils/auth'

let loadingInstance = null

const service = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    if (!config.hasOwnProperty('showLoading') || config.showLoading === true) {
      loadingInstance = Loading.service({})
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.transformRequest = [function(data) {
      data['app_id'] = getAppId()
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
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    const res = response.data
    if (res.status !== 200) {
      if (res.status === 401) {
        MessageBox.confirm('登陆信息已过期，请重新登录。', '重新登陆', {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          type: 'warning'
        }).then(() => {
          removeToken()
          location.reload()
        })
        return Promise.reject()
      } else {
        Message({
          message: res.message || '请求错误，请稍后再试',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      res.data = decodeURIComponent(res.data)
      return res
    }
  },
  error => {
    if (loadingInstance) loadingInstance.close()
    var err = error.response.data
    if (err.status === 401) {
      MessageBox.confirm('登陆信息已过期，请重新登录。', '重新登陆', {
        confirmButtonText: '确定',
        showCancelButton: false,
        showClose: false,
        type: 'warning'
      }).then(() => {
        removeToken()
        location.reload()
      })
      return Promise.reject()
    } else {
      Message({
        message: err.message || `未知异常`,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
