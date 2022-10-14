import request from '@/utils/request'

export function getRolesList(user_type) {
  return request({
    url: '/api/sys/role/list',
    method: 'post',
    data: {
      user_type: user_type,
      status_flag: '1'
    }
  })
}

export function paginate(search, page, page_size) {
  const { role_name, has_fp } = search
  return request({
    url: '/api/sys/role/paginate',
    method: 'post',
    data: {
      role_name: role_name,
      has_fp: has_fp,
      page_num: page,
      page_size: page_size
    }
  })
}

export function addRole(form) {
  const { role_name, role_desc, fp_id } = form
  return request({
    url: '/api/sys/role/save',
    method: 'post',
    data: {
      role_name: role_name,
      role_desc: role_desc,
      fp_id: fp_id
    }
  })
}

export function editRole(role_id, form) {
  const { role_name, role_desc, fp_id } = form
  return request({
    url: '/api/sys/role/update',
    method: 'post',
    data: {
      role_name: role_name,
      role_desc: role_desc,
      role_id: role_id,
      fp_id: fp_id
    }
  })
}

export function deleteRole(role_id) {
  return request({
    url: '/api/sys/role/delete',
    method: 'post',
    data: {
      role_id: role_id
    }
  })
}

export function getRole(role_id) {
  return request({
    url: '/api/sys/role/detail',
    method: 'post',
    data: {
      role_id: role_id
    }
  })
}

export function getRoleAuth(role_id, user_type) {
  return request({
    url: '/api/sys/role/fp',
    method: 'post',
    data: {
      role_id: role_id,
      user_type: user_type
    }
  })
}

export function editRoleAuth(role_id, fp_id) {
  return request({
    url: '/api/sys/role/fp/update',
    method: 'post',
    data: {
      role_id: role_id,
      fp_id: fp_id
    }
  })
}

export function getSclDefaultRole() {
  return request({
    url: '/api/sys/role/fp/default/scl',
    method: 'post',
    data: {}
  })
}

export function editSclDefaultRoleAuth(fp_id) {
  return request({
    url: '/api/sys/role/fp/default/scl/update',
    method: 'post',
    data: {
      fp_id: fp_id
    }
  })
}

export function getEduDefaultRole() {
  return request({
    url: '/api/sys/role/fp/default/edu',
    method: 'post',
    data: {}
  })
}

export function editEduDefaultRoleAuth(fp_id) {
  return request({
    url: '/api/sys/role/fp/default/edu/update',
    method: 'post',
    data: {
      fp_id: fp_id
    }
  })
}
