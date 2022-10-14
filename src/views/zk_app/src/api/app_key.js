import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { keyword, status_flag } = search
  return request({
    url: '/api/sys/app/paginate',
    method: 'post',
    data: {
      keyword: keyword,
      status_flag: status_flag,
      page_num: page,
      page_size: page_size
    }
  })
}

export function enableAppKey(app_id) {
  return request({
    url: '/api/sys/app/enable',
    method: 'post',
    data: {
      id: app_id
    }
  })
}

export function disableAppKey(app_id) {
  return request({
    url: '/api/sys/app/disable',
    method: 'post',
    data: {
      id: app_id
    }
  })
}

export function syncToCache() {
  return request({
    url: '/api/sys/app/sync',
    method: 'post',
    data: {}
  })
}

export function addAppKey(data) {
  const { app_name, expire_time, verify_token, token_expire, user_type } = data
  return request({
    url: '/api/sys/app/save',
    method: 'post',
    data: {
      app_name: app_name,
      expire_time: expire_time,
      verify_token: verify_token,
      token_expire: token_expire,
      user_type: user_type
    }
  })
}

export function editAppKey(app_id, data) {
  const { app_name, expire_time, verify_token, token_expire, user_type } = data
  return request({
    url: '/api/sys/app/update',
    method: 'post',
    data: {
      id: app_id,
      app_name: app_name,
      expire_time: expire_time,
      verify_token: verify_token,
      token_expire: token_expire,
      user_type: user_type
    }
  })
}

