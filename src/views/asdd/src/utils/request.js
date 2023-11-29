import axios from 'axios'
import store from '@/store'
import { MessageBox, Message, Loading } from 'element-ui'
import { nowTime, getToken, getLoginIdKey, getAppVersion, getDevice, getSign, getNonce, getRsaCode, encrypt, decrypt } from '@/utils/auth'

// 显示全屏加载
let loading = null
let show_loading = false
// 显示报错消息提示
let show_message = true
// 返回数据时是否进行解密
let data_decrypt = true
// 返回数据是否为文件流
let show_file = false

// axios配置
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 30000
})

service.interceptors.request.use(config => {
  config.hasOwnProperty('show_loading') ? show_loading = config.show_loading : show_loading = false
  config.hasOwnProperty('show_message') ? show_message = config.show_message : show_message = true
  config.hasOwnProperty('data_decrypt') ? data_decrypt = config.data_decrypt : data_decrypt = true
  config.hasOwnProperty('show_file') ? show_file = config.show_file : show_file = false
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (show_loading) {
    loading = Loading.service({})
  }
  if (show_file) {
    config.responseType = 'blob'
  }
  config.transformRequest = [function(parameter = {}) {
    // 加密参数预处理
    parameter.token = getToken()
    parameter.device = getDevice()
    parameter.timestamp = nowTime()
    parameter.login_id = getLoginIdKey()
    parameter.app_version = getAppVersion()
    parameter['sign'] = getSign(parameter)
    const aes_key = getNonce()
    const encipher = {
      app_id: import.meta.env.VITE_APP_ID,
      data: encodeURIComponent(encrypt(JSON.stringify(parameter), aes_key)),
      encrypt_key: encodeURIComponent(getRsaCode(aes_key))
    }
    // 传递参数转换格式
    let ret = ''
    for (const it in encipher) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(encipher[it]) + '&'
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
    if (show_loading) loading.close()
    const res = response.data
    if (show_file) {
      return res
    } else {
      if (res.status !== 200) {
        return errTip(res)
      } else {
        if (typeof res.data !== 'object') {
          if (data_decrypt) {
            res.data = JSON.parse(decrypt(decodeURIComponent(res.data)))
          } else {
            res.data = decodeURIComponent(res.data)
          }
        }
        return res
      }
    }
  },
  error => {
    if (show_loading) loading.close()
    const err = error.response.data
    return errTip(err)
  }
)

function errTip(res) {
  if (res.status === 401) {
    MessageBox.confirm('登陆信息已过期，请重新登录。', '重新登陆', {
      confirmButtonText: '确定',
      showCancelButton: false,
      showClose: false,
      type: 'warning'
    }).then(() => {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    })
    return Promise.reject()
  } else {
    if (show_message) {
      Message({
        message: res.message || '请求错误，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(new Error(res.message || 'Error'))
  }
}

export default service
