import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { keyword, equ_type, data } = search
  return request({
    url: '/api/sys/equipment/ipc/info/paginate',
    method: 'post',
    data: {
      keyword: keyword,
      equ_type: equ_type,
      scl_id: data.scl_id,
      page_num: page,
      page_size: page_size
    }
  })
}

export function equtype() {
  return request({
    url: '/api/sys/dic/child/equ/type',
    method: 'post',
    data: {}
  })
}

export function equVender() {
  return request({
    url: '/api/sys/dic/child/equ/vender',
    method: 'post',
    data: {}
  })
}

export function detail(id) {
  return request({
    url: '/api/sys/equipment/ipc/info/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function save(form) {
  return request({
    url: '/api/sys/equipment/ipc/info/save',
    method: 'post',
    data: {
      scl_id: form.data.scl_id,
      equ_name: form.equ_name,
      equ_ip: form.equ_ip,
      equ_port: form.equ_port,
      equ_hard_ver: form.equ_hard_ver,
      equ_soft_ver: form.equ_soft_ver,
      equ_type: form.equ_type,
      equ_desc: form.equ_desc
    }
  })
}

export function update(id, form) {
  return request({
    url: '/api/sys/equipment/ipc/info/update',
    method: 'post',
    data: {
      id: id,
      scl_id: form.data.scl_id,
      equ_name: form.equ_name,
      equ_ip: form.equ_ip,
      equ_port: form.equ_port,
      equ_hard_ver: form.equ_hard_ver,
      equ_soft_ver: form.equ_soft_ver,
      equ_type: form.equ_type,
      equ_desc: form.equ_desc
    }
  })
}

export function del(id) {
  return request({
    url: '/api/sys/equipment/ipc/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
