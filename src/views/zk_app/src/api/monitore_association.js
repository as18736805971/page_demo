import request from '@/utils/request'

export function getRelCamera(role_id) {
  return request({
    url: '/api/dd/scl/user/rel/list',
    method: 'post',
    data: {
      role_id: role_id
    }
  })
}

export function getCameraList() {
  return request({
    url: '/api/dd/camera/assign/list',
    method: 'post',
    data: {}
  })
}

export function getRelCameraSave(role_id, equ_id) {
  return request({
    url: '/api/dd/scl/user/rel/save',
    method: 'post',
    data: {
      role_id: role_id,
      equ_id: equ_id
    }
  })
}

export function removeCamera(ro_equ_id) {
  return request({
    url: '/api/dd/scl/user/rel/delete',
    method: 'post',
    data: {
      ro_equ_id: ro_equ_id
    }
  })
}
