import request from '@/utils/request'

export function paginate(keyword, dept_id, page, page_size) {
  return request({
    url: '/api/dd/school/user/paginate',
    method: 'post',
    data: {
      keyword: keyword,
      dept_id: dept_id,
      page_num: page,
      page_size: page_size
    }
  })
}

export function deleteUser(user_id) {
  return request({
    url: '/api/dd/school/user/delete',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function addUser(form) {
  const data = { ...form }
  return request({
    url: '/api/dd/school/user/save',
    method: 'post',
    data: data
  })
}

export function editUser(user_id, data) {
  return request({
    url: '/api/dd/school/user/update',
    method: 'post',
    data: {
      user_name: data.user_name,
      user_phone: data.user_phone,
      user_gender: data.user_gender,
      user_email: data.user_email,
      user_role: data.user_role,
      user_id: user_id
    }
  })
}

export function getUser(user_id) {
  return request({
    url: '/api/dd/school/user/info',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function resetPassword(user_id) {
  return request({
    url: '/api/dd/school/user/initpwd',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function getSclUserList() {
  return request({
    showLoading: false,
    url: '/api/dd/school/user/list',
    method: 'post',
    data: {}
  })
}

export function getNoDeptUser() {
  return request({
    url: '/api/dd/school/user/list/nodept',
    method: 'post',
    data: {}
  })
}

export function userAddDept(user_id, dept_id) {
  return request({
    url: '/api/dd/school/user/adddept',
    method: 'post',
    data: {
      user_id: user_id,
      dept_id: dept_id
    }
  })
}

export function userDelDept(user_id) {
  return request({
    url: '/api/dd/school/user/deldept',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function mmTeaSyn(scl_id) {
  return request({
    url: '/api/dd/school/user/mmTeaSyn',
    method: 'post',
    data: {
      scl_id: scl_id
    }
  })
}
