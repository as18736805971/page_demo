import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { keyword, data } = search
  return request({
    url: '/api/dd/camera/paginate',
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
    url: '/api/dd/camera/save',
    method: 'post',
    data: {
      scl_id: form.data.scl_id,
      equ_type: form.equ_type,
      equ_name: form.equ_name,
      equ_desc: form.equ_desc,
      equ_vender: form.equ_vender,
      rtsp: form.rtsp,
      hls: form.hls,
      rtmp: form.rtmp
    }
  })
}

export function update(id, form) {
  return request({
    url: '/api/dd/camera/update',
    method: 'post',
    data: {
      equ_id: id,
      scl_id: form.data.scl_id,
      equ_type: form.equ_type,
      equ_name: form.equ_name,
      equ_desc: form.equ_desc,
      equ_vender: form.equ_vender,
      rtsp: form.rtsp,
      hls: form.hls,
      rtmp: form.rtmp
    }
  })
}

export function del(id) {
  return request({
    url: '/api/dd/camera/delete',
    method: 'post',
    data: {
      equ_id: id
    }
  })
}

export function change(id, status) {
  return request({
    url: '/api/dd/camera/change',
    method: 'post',
    data: {
      equ_id: id,
      camera_status: status
    }
  })
}

export function get_camera_detail(id) {
  return request({
    url: '/api/dd/camera/detail',
    method: 'post',
    data: {
      equ_id: id
    }
  })
}
