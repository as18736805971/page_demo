import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { keyword, data } = search
  return request({
    url: '/api/dd/audio/paginate',
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
    url: '/api/dd/audio/save',
    method: 'post',
    data: {
      scl_id: form.data.scl_id,
      equ_type: form.equ_type,
      equ_name: form.equ_name,
      equ_desc: form.equ_desc,
      equ_vender: form.equ_vender,
      audio_ip: form.audio_ip,
      audio_no: form.audio_no,
      relay_ip: form.relay_ip
    }
  })
}

export function update(id, form) {
  return request({
    url: '/api/dd/audio/update',
    method: 'post',
    data: {
      equ_id: id,
      scl_id: form.data.scl_id,
      equ_type: form.equ_type,
      equ_name: form.equ_name,
      equ_desc: form.equ_desc,
      equ_vender: form.equ_vender,
      audio_ip: form.audio_ip,
      audio_no: form.audio_no,
      relay_ip: form.relay_ip
    }
  })
}

export function del(id) {
  return request({
    url: '/api/dd/audio/delete',
    method: 'post',
    data: {
      equ_id: id
    }
  })
}

