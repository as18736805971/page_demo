import md5 from 'js-md5'
import * as CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'

const TokenKey = 'token'

export function getToken() {
  const token = localStorage.getItem(TokenKey)
  return token || ''
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getAppId() {
  return 'd5a1db4cfd2542c698a1f5d88fa44224'
}

export function nowTime() {
  return Date.parse(new Date()).toString().substr(0, 10)
}

export function getSign(data) {
  const arr_key = Object.keys(data).sort()
  let str = ''
  arr_key.forEach(i => {
    data[i] = (data[i] == null ? '' : data[i])
    str += i + '=' + data[i]
  })
  str += '9511bd681d8243368191f19060a5eb67'
  return md5(str)
}

export function getRandomKey() {
  let str = ''
  const range = 16
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  // 随机产生
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

export function encryptPassword(raw_key, password, pub_key) {
  // 1.生成16位密钥
  const aes_key = CryptoJS.enc.Utf8.parse(raw_key)
  const iv = CryptoJS.enc.Utf8.parse(md5(raw_key).substr(0, 16))
  // 2.AES加密密码
  const encrypted = CryptoJS.AES.encrypt(password, aes_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  // 3.RSA加密AES密钥
  const jse = new JSEncrypt()
  jse.setPublicKey(pub_key)
  const key = jse.encrypt(raw_key)
  const result = {
    aes_password: encrypted,
    key: key
  }
  return result
}

export function encrypt(word) {
  const encrypted = CryptoJS.AES.encrypt(word, 'aes')
  return encrypted.toString()
}

export function decrypt(word) {
  const decrypt = CryptoJS.AES.decrypt(word, 'aes')
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
