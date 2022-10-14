import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import * as CryptoJS from 'crypto-js'
import request from '@/utils/request'
const TokenKey = 'token'

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
  sessionStorage.removeItem('login_role')
  sessionStorage.removeItem('roles')
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

export function decrypt(word = '') {
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
  var pub_key = process.env.VUE_APP_PUBLIC_KEY// ES6 模板字符串 引用 rsa 公钥
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
