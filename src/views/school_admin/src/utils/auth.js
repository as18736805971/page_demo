import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import * as CryptoJS from 'crypto-js'
import request from '@/utils/request'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
const TokenKey = 'school_token'

export function getToken() {
  const token = localStorage.getItem(TokenKey)
  return token || ''
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function getAppVersion() {
  return '1.0.0'
}

export function getDevice() {
  return ''
}

export function getRsaPublicKey() {
  return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLcJkf/ovAjAMDmhtjH/Il2W/Z08n5d8r3LB4sAZb26DsEtQayFNdJEMUdd7WUpd3mJ4DAVwHVUdps0bM/1QUrUiNxDaoarq5FqKQ/iSBTpMlBFGRBZD6XibJpabOJR1nTjQgT/ML3IxgmLIyuV9oYkIEObdVmIIGVVvE4KfHz0wIDAQAB'
}

export function getAesKey() {
  return getNonce()
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem('school_roles')
  sessionStorage.removeItem('login_role')
  sessionStorage.removeItem('role')
  return
}

// 请求app_id
export function getAppId() {
  return process.env.VUE_APP_ID
}

// 请求地址
export function getBaseURL() {
  return process.env.VUE_APP_BASE_API
}

export function nowTime() {
  return Date.parse(new Date()).toString().substr(0, 10)
}

export function getSign(data) {
  const arr_key = Object.keys(data).sort()
  let str = ''
  arr_key.forEach(i => {
    // 加密时去掉 sign 防止重复拼接 sign
    if (i !== 'sign') {
      data[i] = (data[i] == null ? '' : data[i])
      str += i + '=' + data[i]
    }
  })
  str += process.env.VUE_APP_BASE_API_KEY
  return md5(str)
}

export function getRandomKey(length = 16) {
  let str = ''
  const range = length
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  // 随机产生
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

export function encrypt(word, aes_key) {
  const keyStr = aes_key
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.CBC,
    iv: key,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

export function decrypt(word) {
  const keyStr = process.env.VUE_APP_AES_KEY
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.CBC,
    iv: key,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

export function getRsaCode(aes_key) {
  var pub_key = process.env.VUE_APP_PUBLIC_KEY // ES6 模板字符串 引用 rsa 公钥
  var encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pub_key)
  var data = encryptStr.encrypt(aes_key.toString())
  return data
}

export function getNonce() {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var nums = ''
  for (var i = 0; i < 16; i++) {
    var id = parseInt(Math.random() * 36)
    nums += chars[id]
  }
  return nums
}

export function httpRequest(url, formdata, showLoading = true, messageShow = true) {
  formdata.timestamp = nowTime()
  formdata.token = getToken()
  formdata.app_version = getAppVersion()
  formdata.device = getDevice()
  formdata['sign'] = getSign(formdata)
  var aes_key = getNonce()
  return request({
    url: url,
    method: 'post',
    data: {
      data: encodeURIComponent(encrypt(JSON.stringify(formdata), aes_key)),
      encrypt_key: encodeURIComponent(getRsaCode(aes_key))
    },
    showLoading: showLoading,
    messageShow: messageShow
  })
}

export function uploadFile(method, formdata, file) {
  formdata.timestamp = nowTime()
  formdata.token = getToken()
  formdata.app_version = getAppVersion()
  formdata.device = getDevice()
  formdata['sign'] = getSign(formdata)
  var aes_key = getNonce()
  const uploadFormData = new FormData()
  const _file = file
  uploadFormData.append('data', encodeURIComponent(encrypt(JSON.stringify(formdata), aes_key)))
  uploadFormData.append('encrypt_key', encodeURIComponent(getRsaCode(aes_key)))
  uploadFormData.append('app_id', getAppId())
  uploadFormData.append('file', _file)
  const url = process.env.VUE_APP_BASE_API + method
  return new Promise((resolve, reject) => {
    axios.post(url, uploadFormData).then(response => {
      const res = response.data
      if (res.status !== 200) {
        if (res.status === 301) {
          MessageBox.confirm('登陆信息已过期，请重新登录。', '重新登陆', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
          return reject()
        } else {
          Message({
            message: res.message || '请求错误，请稍后再试',
            type: 'error',
            duration: 5 * 1000
          })
          return reject(new Error(res.message || 'Error'))
        }
      }
      res.data = decodeURIComponent(res.data)
      resolve(res)
    }, err => {
      Message({
        message: err.message,
        type: 'error',
        duration: 5 * 1000
      })
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}
