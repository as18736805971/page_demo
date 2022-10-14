import request from '@/utils/request'

export function paginate(keyword, page, page_size) {
  return request({
    url: '/api/dd/scmo/info/list',
    method: 'post',
    data: {
      keyword: keyword,
      page_num: page,
      page_size: page_size
    }
  })
}

export function save_scmo(scmo_name, scmo_code) {
  return request({
    url: '/api/dd/scmo/info/save',
    method: 'post',
    data: {
      scmo_name: scmo_name,
      scmo_code: scmo_code
    }
  })
}

export function update_scmo(scmo_id, scmo_name, scmo_code) {
  return request({
    url: '/api/dd/scmo/info/update',
    method: 'post',
    data: {
      scmo_id: scmo_id,
      scmo_name: scmo_name,
      scmo_code: scmo_code
    }
  })
}

export function enable_scmo(scmo_id) {
  return request({
    url: '/api/dd/scmo/info/enable',
    method: 'post',
    data: {
      scmo_id: scmo_id
    }
  })
}

export function deactivate_scmo(scmo_id) {
  return request({
    url: '/api/dd/scmo/info/deactivate',
    method: 'post',
    data: {
      scmo_id: scmo_id
    }
  })
}

export function del_scmo(scmo_id) {
  return request({
    url: '/api/dd/scmo/info/delete',
    method: 'post',
    data: {
      scmo_id: scmo_id
    }
  })
}
