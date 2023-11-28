import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import * as CryptoJS from 'crypto-js'

const TokenKey = 'token'
const LoginIdKey = 'login_id'

export function setToken(token, login_id) {
  localStorage.setItem(TokenKey, token)
  localStorage.setItem(LoginIdKey, login_id)
}

export function getToken() {
  const token = localStorage.getItem(TokenKey)
  return token || ''
}

export function getLoginIdKey() {
  const login_id = localStorage.getItem(LoginIdKey)
  return login_id || ''
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(LoginIdKey)
  localStorage.removeItem('role_group')
}

export function getAppVersion() {
  return '1.0.0'
}

export function getDevice() {
  return ''
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
  str += import.meta.env.VITE_APP_SIGN_SECRET
  return md5(str)
}

export function encrypt(word, aes_key) {
  const key = CryptoJS.enc.Utf8.parse(aes_key)
  const src = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    mode: CryptoJS.mode.CBC,
    iv: key,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

export function decrypt(word = '') {
  const keyStr = import.meta.env.VITE_APP_AES_KEY
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.CBC,
    iv: key,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

export function getRsaCode(aes_key) {
  const pub_key = import.meta.env.VITE_APP_PUBLIC_KEY
  const encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pub_key)
  return encryptStr.encrypt(aes_key.toString())
}

export function getNonce() {
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let nums = ''
  for (let i = 0; i < 16; i++) {
    const id = parseInt(Math.random() * 36)
    nums += chars[id]
  }
  return nums
}

/**
 * 生成随机数
 * length 数量
 */
export function getRandomKey(length = 16) {
  let str = ''
  const range = length
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}
