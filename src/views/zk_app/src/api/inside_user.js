import request from '@/utils/request'

export function paginate(keyword, page, page_size) {
  return request({
    url: '/api/sys/user/inside/paginate',
    method: 'post',
    data: {
      keyword: keyword,
      page_num: page,
      page_size: page_size
    }
  })
}

export function disableUser(user_id) {
  return request({
    url: '/api/sys/user/inside/disable',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function enableUser(user_id) {
  return request({
    url: '/api/sys/user/inside/enable',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function addUser(form) {
  const data = { ...form }
  return request({
    url: '/api/sys/user/inside/save',
    method: 'post',
    data: data
  })
}

export function editUser(user_id, data) {
  return request({
    url: '/api/sys/user/inside/update',
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
    url: '/api/sys/user/inside/detail',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}
