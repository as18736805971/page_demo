import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

export function loginInside(data) {
  return request({
    url: '/api/login/inside',
    method: 'post',
    data: data
  })
}

export function loginEdu(data) {
  return request({
    url: '/api/login/edu',
    method: 'post',
    data: data
  })
}

export function loginSch(data) {
  return request({
    url: '/api/login/sch',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/api/login/logout',
    method: 'post',
    data: {}
  })
}

export function getSms(account) {
  return request({
    url: '/api/login/sms/uppwd',
    method: 'post',
    data: {
      account: account
    }
  })
}

export function loginUppwd(account, sms_code, password, enaeskey) {
  return request({
    url: '/api/login/uppwd',
    method: 'post',
    data: {
      account: account,
      sms_code: sms_code,
      password: password,
      enaeskey: enaeskey
    }
  })
}

export function getPubKey() {
  return request({
    showLoading: false,
    url: '/api/login/publicKey',
    method: 'post',
    data: {}
  })
}

export function getInfo(token) {
  return request({
    showLoading: false,
    url: '/api/login/user',
    method: 'post',
    data: {
      token: token
    }
  })
}

export function getAuth(token) {
  return request({
    url: '/api/login/auth',
    method: 'post',
    data: {
      token: token
    }
  })
}

export function uppwd(old_password, new_password, old_enaeskey, new_enaeskey) {
  return request({
    url: '/api/sys/user/uppwd',
    method: 'post',
    data: {
      old_password: old_password,
      new_password: new_password,
      old_enaeskey: old_enaeskey,
      new_enaeskey: new_enaeskey
    }
  })
}

export function captcha(token) {
  const data = {
    captcha_key: token
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/login/captcha?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function ImportPaginate(page_num, page_size) {
  return request({
    url: '/api/dd/batch/scluser/paginate',
    method: 'post',
    data: {
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function insideScl(scl_id) {
  return request({
    url: '/api/sys/user/inside/choosescl',
    method: 'post',
    data: {
      scl_id: scl_id
    }
  })
}

export function clearscl() {
  return request({
    url: '/api/sys/user/inside/clearscl',
    method: 'post',
    data: {}
  })
}

export function mumu_login(accessToken) {
  return request({
    url: '/api/login/mumu',
    method: 'post',
    data: {
      accessToken: accessToken
    }
  })
}

