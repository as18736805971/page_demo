import request from '@/utils/request'

export function save(form) {
  return request({
    url: '/api/app/function/save',
    method: 'post',
    data: {
      af_code: form.af_code,
      af_name: form.af_name,
      af_client: form.af_client
    }
  })
}

export function update(form, af_id) {
  return request({
    url: '/api/app/function/update',
    method: 'post',
    data: {
      af_id: af_id,
      af_code: form.af_code,
      af_name: form.af_name,
      af_client: form.af_client
    }
  })
}

export function disable(af_id) {
  return request({
    url: '/api/app/function/disable',
    method: 'post',
    data: {
      af_id: af_id
    }
  })
}

export function enable(af_id) {
  return request({
    url: '/api/app/function/enable',
    method: 'post',
    data: {
      af_id: af_id
    }
  })
}

export function paginate(search, page, page_size) {
  const { keyword } = search
  return request({
    url: '/api/app/function/paginate',
    method: 'post',
    data: {
      af_name: keyword,
      page_num: page,
      page_size: page_size
    }
  })
}

export function allFunction() {
  return request({
    url: '/api/app/function/list',
    method: 'post',
    data: {}
  })
}

export function defaultSave(user_type, app_function) {
  return request({
    url: '/api/app/org/config/default/save',
    method: 'post',
    data: {
      user_type: user_type,
      app_function: app_function
    }
  })
}

export function configSave(user_type, app_function, org_id, role_id) {
  return request({
    url: '/api/app/org/config/save',
    method: 'post',
    data: {
      user_type: user_type,
      app_function: app_function,
      org_id: org_id,
      role_id: role_id
    }
  })
}

export function appSclPaginate(scl_name, page, page_size) {
  return request({
    url: '/api/app/org/config/scl/paginate',
    method: 'post',
    data: {
      scl_name: scl_name,
      page_num: page,
      page_size: page_size
    }
  })
}

export function appSclChoose(org_id, role_id) {
  return request({
    url: '/api/app/org/config/choose/list',
    method: 'post',
    data: {
      org_id: org_id,
      role_id: role_id
    }
  })
}

