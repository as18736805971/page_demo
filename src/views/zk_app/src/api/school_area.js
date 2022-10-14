import request from '@/utils/request'

export function paginate(search, page, page_size) {
  return request({
    url: '/api/dd/school/area/paginate',
    method: 'post',
    data: {
      scl_id: search.scl_id,
      area_name: search.area_name,
      page_num: page,
      page_size: page_size
    }
  })
}

export function deleteSclArea(area_id) {
  return request({
    url: '/api/dd/school/area/delete',
    method: 'post',
    data: {
      area_id: area_id
    }
  })
}

export function addSclArea(form) {
  const data = { ...form }
  return request({
    url: '/api/dd/school/area/save',
    method: 'post',
    data: data
  })
}

export function editSclArea(area_id, data) {
  return request({
    url: '/api/dd/school/area/update',
    method: 'post',
    data: {
      scl_id: data.scl_id,
      area_name: data.area_name,
      area_model_name: data.area_model_name,
      area_risk_level: data.area_risk_level,
      area_id: area_id
    }
  })
}

export function getSclArea(area_id) {
  return request({
    url: '/api/dd/school/area/info',
    method: 'post',
    data: {
      area_id: area_id
    }
  })
}
