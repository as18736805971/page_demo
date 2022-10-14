import request from '@/utils/request'

export function getDic(dic_type_code) {
  return request({
    showLoading: false,
    url: '/api/sys/dic/list',
    method: 'post',
    data: {
      dic_type_code: dic_type_code
    }
  })
}

export function addDic(data) {
  const { dic_type_code, dic_type_name, dic_code, dic_name, dic_desc, status_flag } = data
  return request({
    showLoading: false,
    url: '/api/sys/dic/save',
    method: 'post',
    data: {
      dic_type_code: dic_type_code,
      dic_type_name: dic_type_name,
      dic_code: dic_code,
      dic_name: dic_name,
      dic_desc: dic_desc,
      status_flag: status_flag
    }
  })
}

export function enableDic(dic_id) {
  return request({
    showLoading: false,
    url: '/api/sys/dic/enable',
    method: 'post',
    data: {
      dic_id: dic_id
    }
  })
}

export function disableDic(dic_id) {
  return request({
    showLoading: false,
    url: '/api/sys/dic/disable',
    method: 'post',
    data: {
      dic_id: dic_id
    }
  })
}

export function delDic(dic_id) {
  return request({
    showLoading: false,
    url: '/api/sys/dic/delete',
    method: 'post',
    data: {
      dic_id: dic_id
    }
  })
}

export function syncDic() {
  return request({
    url: '/api/sys/dic/sync',
    method: 'post',
    data: {}
  })
}

export function syncArea() {
  return request({
    url: '/api/sys/area/sync',
    method: 'post',
    data: {}
  })
}
