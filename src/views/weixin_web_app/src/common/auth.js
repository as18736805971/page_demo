import md5 from 'js-md5'
import * as CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'

const TokenKey = 'token'

export function getToken() {
  const token = sessionStorage.getItem(TokenKey)
  return token || ''
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function nowTime() {
  return Date.parse(new Date()).toString().substr(0, 10)
}

export function getSign(data) {
  const arr_key = Object.keys(data).sort()
  let str = ''
  arr_key.forEach(i => {
    // 加密时去掉 sign
    if (i !== 'sign') {
      data[i] = (data[i] == null ? '' : data[i])
      str += i + '=' + data[i]
    }
  })
  return md5(str)
}

export function getQuery(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
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

export function encryption(pwd, pubkey) {
  var encryptor = new JSEncrypt();  // 创建加密对象实例
  encryptor.setPublicKey(pubkey)   //设置公钥
  let rsaPassWord = encryptor.encrypt(pwd)  // 对内容进行加密
  return rsaPassWord;
}

export function encrypt(word) {
  const encrypted = CryptoJS.AES.encrypt(word, 'aes')
  return encrypted.toString()
}

export function decrypt(word) {
  const decrypt = CryptoJS.AES.decrypt(word, 'aes')
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
