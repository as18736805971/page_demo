import request from '@/utils/request'

export function getLabelList() {
  return request({
    url: '/api/dd/school/mark/list',
    method: 'post',
    data: {}
  })
}

export function addLabel(param) {
  return request({
    url: '/api/dd/school/mark/save',
    method: 'post',
    data: {
      relation_id: param.relation_id,
      mark_type: param.mark_type,
      mark_x: 0,
      mark_y: 150,
      mark_z: 0
    }
  })
}

export function editLabel(param) {
  return request({
    url: '/api/dd/school/mark/update',
    method: 'post',
    data: {
      id: param.id,
      relation_id: param.relation_id,
      mark_type: param.mark_type
    }
  })
}

export function deleteLabel(id) {
  return request({
    url: '/api/dd/school/mark/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function changeLabelcoord(param) {
  return request({
    showLoading: false,
    url: '/api/dd/school/mark/update/coord',
    method: 'post',
    data: {
      id: param.id,
      mark_x: param.mark_x,
      mark_y: param.mark_y,
      mark_z: param.mark_z
    }
  })
}

export function getPatrolList() {
  return request({
    url: '/api/dd/school/mark/patrol/list',
    method: 'post',
    data: {
    }
  })
}

export function getCameraList() {
  return request({
    url: '/api/dd/school/mark/camera/list',
    method: 'post',
    data: {
    }
  })
}
