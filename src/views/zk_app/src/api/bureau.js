import request from '@/utils/request'

// 获取教育局信息列表
export function infoPaginate(keyword, province_code, area_code, county_code, page_num, page_size) {
  return request({
    url: '/api/dd/edu/info/paginate',
    method: 'post',
    data: {
      status_flag: 1,
      keyword: keyword,
      province_code: province_code,
      area_code: area_code,
      county_code: county_code,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 添加教育局信息
export function addEduinfo(edu_name, province_code, area_code, county_code, edu_address, edu_phone, user_name, user_phone) {
  return request({
    url: '/api/dd/edu/info/save',
    method: 'post',
    data: {
      edu_name: edu_name,
      province_code: province_code,
      area_code: area_code,
      county_code: county_code,
      edu_phone: edu_phone,
      edu_address: edu_address,
      user_name: user_name,
      user_phone: user_phone
    }
  })
}

// 修改教育局信息
export function updateEduinfo(edu_id, edu_name, province_code, area_code, county_code, edu_address, edu_phone, user_name, user_phone) {
  return request({
    url: '/api/dd/edu/info/update',
    method: 'post',
    data: {
      edu_id: edu_id,
      edu_name: edu_name,
      province_code: province_code,
      area_code: area_code,
      county_code: county_code,
      edu_phone: edu_phone,
      edu_address: edu_address
    }
  })
}

// 删除教育局信息
export function deleteEduinfo(edu_id) {
  return request({
    url: '/api/dd/edu/info/delete',
    method: 'post',
    data: {
      edu_id: edu_id
    }
  })
}

// 获取教育局用户列表
export function userPaginate(keyword, page_num, page_size) {
  return request({
    url: '/api/dd/edu/user/paginate',
    method: 'post',
    data: {
      keyword: keyword,
      status_flag: 1,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 添加教育局用户
export function addEduuser(form) {
  const data = { ...form }
  return request({
    url: '/api/dd/edu/user/save',
    method: 'post',
    data: data
  })
}

// 修改教育局用户
export function updateEduuser(user_id, user_role, user_name, user_phone, user_gender, user_email) {
  return request({
    url: '/api/dd/edu/user/update',
    method: 'post',
    data: {
      user_id: user_id,
      user_role: user_role,
      user_name: user_name,
      user_phone: user_phone,
      user_gender: user_gender,
      user_email: user_email
    }
  })
}

// 删除教育局用户
export function deleteEduuser(user_id) {
  return request({
    url: '/api/dd/edu/user/delete',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

// 初始化教育局密码
export function initpwd(user_id) {
  return request({
    url: '/api/dd/edu/user/initpwd',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

// 获取教育局学校列表
export function relList(edu_id) {
  return request({
    url: '/api/dd/edu/school/rel/list',
    method: 'post',
    data: {
      edu_id: edu_id
    }
  })
}

// 添加教育局学校
export function relListSave(edu_id, scl_id) {
  return request({
    url: '/api/dd/edu/school/rel/save',
    method: 'post',
    data: {
      edu_id: edu_id,
      scl_id: scl_id
    }
  })
}

export function getSchoolListInfo() {
  return request({
    url: '/api/dd/edu/school/rel/listSchool',
    method: 'post',
    data: {}
  })
}
