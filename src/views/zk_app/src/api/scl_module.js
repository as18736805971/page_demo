import request from '@/utils/request'

export function scl_module() {
  return request({
    url: '/api/dd/scmo/school/list',
    method: 'post',
    data: {}
  })
}

export function enable_scmo(scmo_id) {
  return request({
    url: '/api/dd/scmo/school/save',
    method: 'post',
    data: {
      scmo_id: scmo_id
    }
  })
}

export function deactivate_scmo(smsc_id) {
  return request({
    url: '/api/dd/scmo/school/delete',
    method: 'post',
    data: {
      smsc_id: smsc_id
    }
  })
}

export function move_scmo(upper_id, lower_id) {
  return request({
    url: '/api/dd/scmo/school/move',
    method: 'post',
    data: {
      upper_id: upper_id,
      lower_id: lower_id
    }
  })
}
