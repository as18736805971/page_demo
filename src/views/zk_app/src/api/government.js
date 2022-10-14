import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

// 获取隐患治理分页列表
export function paginate(hd_type, hd_level, hd_status, start_time, end_time, keyword, page_num, page_size, scl_id) {
  return request({
    url: '/api/dd/hidden/danger/info/paginate',
    method: 'post',
    data: {
      hd_type: hd_type,
      hd_level: hd_level,
      hd_status: hd_status,
      start_time: start_time,
      end_time: end_time,
      keyword: keyword,
      page_num: page_num,
      page_size: page_size,
      scl_id: scl_id
    }
  })
}

// 获取隐患治理我上报分页列表
export function paginateMeadd(hd_type, hd_level, hd_status, start_time, end_time, keyword, page_num, page_size) {
  return request({
    url: '/api/dd/hidden/danger/info/meadd',
    method: 'post',
    data: {
      hd_type: hd_type,
      hd_level: hd_level,
      hd_status: hd_status,
      start_time: start_time,
      end_time: end_time,
      keyword: keyword,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取隐患治理我处理分页列表
export function paginateMedealWeb(hd_type, hd_level, hd_status, start_time, end_time, keyword, page_num, page_size) {
  return request({
    url: '/api/dd/hidden/danger/info/medealWeb',
    method: 'post',
    data: {
      hd_type: hd_type,
      hd_level: hd_level,
      hd_status: hd_status,
      start_time: start_time,
      end_time: end_time,
      keyword: keyword,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取隐患治理我治理分页列表
export function paginateMetreat(hd_type, hd_level, start_time, end_time, keyword, page_num, page_size) {
  return request({
    url: '/api/dd/hidden/danger/info/metreat',
    method: 'post',
    data: {
      hd_type: hd_type,
      hd_level: hd_level,
      start_time: start_time,
      end_time: end_time,
      keyword: keyword,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取隐患治理逾期隐患
export function paginateExpire(hd_type, hd_level, hd_status, start_time, end_time, keyword, page_num, page_size) {
  return request({
    url: '/api/dd/hidden/danger/info/expire',
    method: 'post',
    data: {
      hd_type: hd_type,
      hd_level: hd_level,
      hd_status: hd_status,
      start_time: start_time,
      end_time: end_time,
      keyword: keyword,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 上报隐患
export function saveDanger(hd_position, hd_desc, hd_type, hd_to_user_id, attachment_url, attachment_name, attachment_ext) {
  return request({
    url: '/api/dd/hidden/danger/info/save',
    method: 'post',
    data: {
      hd_position: hd_position,
      hd_desc: hd_desc,
      hd_type: hd_type,
      hd_to_user_id: hd_to_user_id,
      attachment_url: attachment_url,
      attachment_name: attachment_name,
      attachment_ext: attachment_ext
    }
  })
}

// 获取隐患详情
export function getDangerInfo(id) {
  return request({
    url: '/api/dd/hidden/danger/info/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 获取隐患详情
export function getDangerProgress(id) {
  return request({
    url: '/api/dd/hidden/danger/info/detailProgress',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 隐患确认
export function confirmDanger(id, hd_to_user_id, is_danger, hd_level, hd_result, hd_remark, hd_except_time) {
  return request({
    url: '/api/dd/hidden/danger/info/confirm',
    method: 'post',
    data: {
      id: id,
      hd_to_user_id: hd_to_user_id,
      is_danger: is_danger,
      hd_level: hd_level,
      hd_result: hd_result,
      hd_remark: hd_remark,
      hd_except_time: hd_except_time
    }
  })
}

// 隐患指派
export function assignDanger(id, hd_response_man_id) {
  return request({
    url: '/api/dd/hidden/danger/info/assign',
    method: 'post',
    data: {
      id: id,
      hd_response_man_id: hd_response_man_id
    }
  })
}

// 隐患治理
export function governDanger(id, hd_to_user_id, hd_treat_result, attachment_url, attachment_name, attachment_ext) {
  return request({
    url: '/api/dd/hidden/danger/info/govern',
    method: 'post',
    data: {
      id: id,
      hd_to_user_id: hd_to_user_id,
      hd_treat_result: hd_treat_result,
      attachment_url: attachment_url,
      attachment_name: attachment_name,
      attachment_ext: attachment_ext
    }
  })
}

// 隐患验收
export function checkDanger(id, check_status, remark) {
  return request({
    url: '/api/dd/hidden/danger/info/check',
    method: 'post',
    data: {
      id: id,
      check_status: check_status,
      remark: remark
    }
  })
}

// 隐患类型字典
export function getdangerType() {
  return request({
    url: '/api/sys/dic/child/hidden/danger/type',
    method: 'post',
    data: {}
  })
}

// 删除隐患
export function deleteDanger(id) {
  return request({
    url: '/api/dd/hidden/danger/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function exportDangerExcel(start_time, end_time) {
  const data = {
    start_time: start_time,
    end_time: end_time
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/hidden/danger/info/exportExcel?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function exportPatrolExcel(start_time, end_time, patrol_status) {
  const data = {
    start_time: start_time,
    end_time: end_time,
    patrol_status: patrol_status
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/report/exportExcel?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

/*
隐患类型管理接口
*/

// 隐患类型列表
export function dangerTypeList() {
  return request({
    url: '/api/dd/hidden/danger/type/list',
    method: 'post',
    data: {
      type_name: ''
    }
  })
}

// 新增隐患类型
export function saveDangerType(type_name) {
  return request({
    url: '/api/dd/hidden/danger/type/save',
    method: 'post',
    data: {
      type_name: type_name
    }
  })
}

// 修改隐患类型
export function updateDangerType(id, type_name) {
  return request({
    url: '/api/dd/hidden/danger/type/update',
    method: 'post',
    data: {
      type_name: type_name,
      id: id
    }
  })
}

// 删除隐患类型
export function delDangerType(id) {
  return request({
    url: '/api/dd/hidden/danger/type/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 获取隐患类型成员列表
export function relationTypeList(type_id, page_num, page_size) {
  return request({
    url: '/api/dd/hidden/danger/type/relation/paginate',
    method: 'post',
    data: {
      type_id: type_id,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 新增隐患类型关联人员
export function saveRelationUser(type_id, user_id) {
  return request({
    url: '/api/dd/hidden/danger/type/relation/save',
    method: 'post',
    data: {
      type_id: type_id,
      user_id: user_id
    }
  })
}

// 获取没有参与该隐患类型的人员列表
export function getNotypeUser(type_id) {
  return request({
    url: '/api/dd/hidden/danger/type/relation/notype/user',
    method: 'post',
    data: {
      type_id: type_id
    }
  })
}

// 删除隐患类型关联人员
export function delRelationUser(id) {
  return request({
    url: '/api/dd/hidden/danger/type/relation/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 隐患类型关联人员列表
export function getRelationList(type_id) {
  return request({
    url: '/api/dd/hidden/danger/type/relation/list',
    method: 'post',
    data: {
      type_id: type_id
    }
  })
}

// 去确认 去指派 去治理 获取推荐人
export function getHiddenUser(hd_id) {
  return request({
    url: '/api/dd/hidden/danger/info/type/userlist',
    method: 'post',
    data: {
      hd_id: hd_id
    }
  })
}

