import request from '@/utils/request'

/**
 * 获取手机登录验证码
 * @data account 手机号
 */
export function getSms(data) {
  return request({
    url: 'api/login/sms',
    method: 'post',
    data: data
  })
}

/**
 * 登录获取用户信息
 * @data account 手机号
 * @data sms_code 验证码
 */
export function getCode(data) {
  return request({
    url: 'api/login/web/smsCode',
    method: 'post',
    data: data,
    data_decrypt: false
  })
}

export function getUserInfo() {
  return request({
    url: 'api/login/user/info',
    method: 'post'
  })
}

/**
 * 获取用户权限
 * @param data
 * @returns {*}
 */
export function authWeb() {
  return request({
    url: 'api/login/authWeb',
    method: 'post'
  })
}
