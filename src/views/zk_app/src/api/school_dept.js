import request from '@/utils/request'

export function getSclDeptList() {
  return request({
    showLoading: false,
    url: '/api/dd/school/dept/list',
    method: 'post',
    data: {}
  })
}

export function addSclDept(form) {
  return request({
    url: '/api/dd/school/dept/save',
    method: 'post',
    data: {
      parent_id: form.parent_id,
      dept_name: form.dept_name,
      dept_response_man: form.dept_response_man,
      dept_phone: form.dept_phone
    }
  })
}

export function editSclDept(dept_id, form) {
  return request({
    url: '/api/dd/school/dept/update',
    method: 'post',
    data: {
      parent_id: form.parent_id,
      dept_name: form.dept_name,
      dept_response_man: form.dept_response_man,
      dept_phone: form.dept_phone,
      dept_id: dept_id
    }
  })
}

export function deleteSclDept(dept_id) {
  return request({
    url: '/api/dd/school/dept/delete',
    method: 'post',
    data: {
      dept_id: dept_id
    }
  })
}

export function getSclDeptInfo(dept_id) {
  return request({
    showLoading: false,
    url: '/api/dd/school/dept/info',
    method: 'post',
    data: {
      dept_id: dept_id
    }
  })
}
