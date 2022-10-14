import request from '@/utils/request'

// 获取功能点列表
export function paginate(obj) {
  return request({
    url: '/api/sys/function/point/list',
    method: 'post',
    data: { ...obj }
  })
}

// 添加功能点
export function addPoint(fp_name, fp_desc, fp_code, pmsn_id) {
  return request({
    url: '/api/sys/function/point/save',
    method: 'post',
    data: {
      fp_name: fp_name,
      fp_desc: fp_desc,
      fp_code: fp_code,
      pmsn_id: pmsn_id
    }
  })
}

// 修改功能点
export function updatePoint(fp_id, fp_name, fp_desc, fp_code, pmsn_id) {
  return request({
    url: '/api/sys/function/point/update',
    method: 'post',
    data: {
      fp_id: fp_id,
      fp_name: fp_name,
      fp_desc: fp_desc,
      fp_code: fp_code,
      pmsn_id: pmsn_id
    }
  })
}

// 删除功能点
export function deleteSys(fp_id) {
  return request({
    url: '/api/sys/function/point/delete',
    method: 'post',
    data: {
      fp_id: fp_id
    }
  })
}

// 查看权限接口
export function viewListrole(fp_id) {
  return request({
    url: '/api/sys/function/point/permission/rela/list',
    method: 'post',
    data: {
      fp_id: fp_id
    }
  })
}

// 功能点和权限绑定
export function bindpermission(fp_id, pmsn_id) {
  return request({
    url: '/api/sys/function/point/permission/rela/save',
    method: 'post',
    data: {
      fp_id: fp_id,
      pmsn_id: pmsn_id
    }
  })
}
