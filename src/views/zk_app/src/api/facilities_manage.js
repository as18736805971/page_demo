import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

// 获取列表数据
export function paginate(facility_name, facility_location, facility_no, page_num, page_size) {
  return request({
    url: '/api/dd/school/facility/info/paginate',
    method: 'post',
    data: {
      facility_name: facility_name,
      facility_location: facility_location,
      facility_no: facility_no,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 新增学校设施
export function saveFacility(facility_name, facility_desc, facility_location, facility_no, facilty_head_person, facilty_head_phone) {
  return request({
    url: '/api/dd/school/facility/info/save',
    method: 'post',
    data: {
      facility_name: facility_name,
      facility_desc: facility_desc,
      facility_location: facility_location,
      facility_no: facility_no,
      facilty_head_person: facilty_head_person,
      facilty_head_phone: facilty_head_phone
    }
  })
}

// 更新学校设施
export function updateFacility(id, facility_name, facility_desc, facility_location, facility_no, facilty_head_person, facilty_head_phone) {
  return request({
    url: '/api/dd/school/facility/info/update',
    method: 'post',
    data: {
      id: id,
      facility_name: facility_name,
      facility_desc: facility_desc,
      facility_location: facility_location,
      facility_no: facility_no,
      facilty_head_person: facilty_head_person,
      facilty_head_phone: facilty_head_phone
    }
  })
}

// 学校设施详情
export function facilityInfo(id) {
  return request({
    url: '/api/dd/school/facility/info/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 删除学校设施
export function delFacility(id) {
  return request({
    url: '/api/dd/school/facility/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 学校设施采集码
export function facilityQrcode(id) {
  return request({
    url: '/api/dd/school/facility/info/qrcode',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function exportFacilityZip() {
  const data = {
    app_id: getAppId(),
    timestamp: nowTime(),
    token: getToken()
  }
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/school/facility/info/exportZip?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 新增视频
export function saveFacilityFv(sf_id, video_name, video_url) {
  return request({
    url: '/api/dd/school/facility/fv/save',
    method: 'post',
    data: {
      sf_id: sf_id,
      video_name: video_name,
      video_url: video_url
    }
  })
}

// 修改视频
export function updateFacilityFv(fv_id, video_name, video_url) {
  return request({
    url: '/api/dd/school/facility/fv/update',
    method: 'post',
    data: {
      fv_id: fv_id,
      video_name: video_name,
      video_url: video_url
    }
  })
}

// 删除视频
export function deleteFacilityFv(fv_id) {
  return request({
    url: '/api/dd/school/facility/fv/delete',
    method: 'post',
    data: {
      fv_id: fv_id
    }
  })
}

// 获取视频列表
export function getFacilityFvList(sf_id) {
  return request({
    url: '/api/dd/school/facility/fv/list',
    method: 'post',
    data: {
      sf_id: sf_id
    }
  })
}
