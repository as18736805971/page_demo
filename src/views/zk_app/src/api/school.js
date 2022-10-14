import request from '@/utils/request'
import { getAppId, getSign, getToken, nowTime } from '@/utils/auth'

export function paginate(search, page, page_size) {
  return request({
    url: '/api/dd/school/info/paginate',
    method: 'post',
    data: {
      scl_name: search.scl_name,
      province_code: search.province_code,
      area_code: search.area_code,
      county_code: search.county_code,
      page_num: page,
      page_size: page_size
    }
  })
}

export function edupaginate(search, page, page_size) {
  return request({
    url: '/api/dd/edu/school/rel/edupaginate',
    method: 'post',
    data: {
      scl_name: search.scl_name,
      page_num: page,
      page_size: page_size
    }
  })
}

export function paginatePajx(scl_id, scl_name, page_num, page_size) {
  return request({
    url: '/api/pajx/scl/paginate',
    method: 'post',
    data: {
      scl_id: scl_id,
      scl_name: scl_name,
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function addSchool(data) {
  return request({
    url: '/api/dd/school/info/save',
    method: 'post',
    data: {
      scl_name: data.scl_name,
      province_code: data.province_code,
      area_code: data.area_code,
      county_code: data.county_code,
      scl_coords: '',
      scl_model: data.scl_model,
      model_cam_init_x: data.model_cam_init_x,
      model_cam_init_y: data.model_cam_init_y,
      model_cam_init_z: data.model_cam_init_z,
      scl_address: data.scl_address,
      scl_phone: data.scl_phone,
      bind_third: data.bind_third,
      mm_schoolid: data.bind_third === '1' ? data.mm_schoolid : '',
      user_name: data.bind_third === '0' ? data.scl_admin_name : '',
      user_phone: data.bind_third === '0' ? data.scl_admin_phone : '',
      scl_location: JSON.stringify(data.scl_location),
      scl_stu_num: data.scl_stu_num,
      scl_tea_num: data.scl_tea_num,
      pajx_scl_id: data.pajx_scl_id,
      pajx_scl_name: data.pajx_scl_name
    }
  })
}

export function getSclInfo(scl_id) {
  return request({
    url: '/api/dd/school/info/info',
    method: 'post',
    data: {
      scl_id: scl_id
    }
  })
}

export function editSchool(data, scl_id) {
  return request({
    url: '/api/dd/school/info/update',
    method: 'post',
    data: {
      scl_id: scl_id,
      scl_name: data.scl_name,
      province_code: data.province_code,
      area_code: data.area_code,
      county_code: data.county_code,
      scl_model: data.scl_model,
      model_cam_init_x: data.model_cam_init_x,
      model_cam_init_y: data.model_cam_init_y,
      model_cam_init_z: data.model_cam_init_z,
      scl_address: data.scl_address,
      scl_phone: data.scl_phone,
      scl_location: JSON.stringify(data.scl_location),
      scl_stu_num: data.scl_stu_num,
      scl_tea_num: data.scl_tea_num,
      pajx_scl_id: data.pajx_scl_id,
      pajx_scl_name: data.pajx_scl_name
    }
  })
}

export function deleteSchool(scl_id) {
  return request({
    url: '/api/dd/school/info/delete',
    method: 'post',
    data: {
      scl_id: scl_id
    }
  })
}

export function getSchoolList() {
  return request({
    showLoading: false,
    url: '/api/dd/school/info/list',
    method: 'post',
    data: {}
  })
}

export function getHistoryList(page, page_size) {
  return request({
    showLoading: false,
    url: '/api/dd/school/upload/paginate',
    method: 'post',
    data: {
      page_num: page,
      page_size: page_size
    }
  })
}

export function download(sb_id) {
  const data = {
    sb_id: sb_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/school/upload/download?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function downloadErr(sb_id) {
  const data = {
    sb_id: sb_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/school/upload/export?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
