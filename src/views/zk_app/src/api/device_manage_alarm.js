import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { keyword, data } = search
  return request({
    url: '/api/dd/alertors/paginate',
    method: 'post',
    data: {
      equ_name: keyword,
      scl_id: data.scl_id,
      page_num: page,
      page_size: page_size
    }
  })
}

export function save(form) {
  return request({
    url: '/api/dd/alertors/save',
    method: 'post',
    data: {
      device_id: form.device_id,
      scl_id: form.data.scl_id,
      equ_type: form.equ_type,
      equ_name: form.equ_name,
      equ_desc: form.equ_desc,
      equ_vender: form.equ_vender,
      equ_position: form.equ_position,
      remark: form.remark,
      duty_name: form.duty_name,
      duty_phone: form.duty_phone
    }
  })
}

export function update(id, form) {
  return request({
    url: '/api/dd/alertors/update',
    method: 'post',
    data: {
      equ_id: id,
      device_id: form.device_id,
      scl_id: form.data.scl_id,
      equ_type: form.equ_type,
      equ_name: form.equ_name,
      equ_desc: form.equ_desc,
      equ_vender: form.equ_vender,
      equ_position: form.equ_position,
      remark: form.remark,
      duty_name: form.duty_name,
      duty_phone: form.duty_phone
    }
  })
}

export function del(id) {
  return request({
    url: '/api/dd/alertors/delete',
    method: 'post',
    data: {
      equ_id: id
    }
  })
}

export function detail(id) {
  return request({
    url: '/api/dd/alertors/info',
    method: 'post',
    data: {
      equ_id: id
    }
  })
}
