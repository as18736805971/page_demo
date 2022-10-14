import request from '@/utils/request'

export function paginate(obj) {
  return request({
    url: '/api/sys/permission/paginate',
    method: 'post',
    data: { ...obj }
  })
}

export function updateSys(pmsn_id, controller_name, pmsn_name, pmsn_desc) {
  return request({
    url: '/api/sys/permission/update',
    method: 'post',
    data: {
      pmsn_id: pmsn_id,
      controller_name: controller_name,
      pmsn_name: pmsn_name,
      pmsn_desc: pmsn_desc
    }
  })
}

export function deleteSys(pmsn_id) {
  return request({
    url: '/api/sys/permission/delete',
    method: 'post',
    data: {
      pmsn_id: pmsn_id
    }
  })
}

export function tidySys() {
  return request({
    url: '/api/sys/permission/tidy',
    method: 'post',
    data: {}
  })
}
