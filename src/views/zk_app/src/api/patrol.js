import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

export function paginate(search, page_num, page_size) {
  return request({
    url: '/api/dd/daily/patrol/info/paginate',
    method: 'post',
    data: {
      patrol_name: search.patrol_name,
      patrol_rate: search.patrol_rate,
      patrol_type: search.patrol_type,
      has_nfc: search.has_nfc,
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function addPatrol(form) {
  return request({
    url: '/api/dd/daily/patrol/info/save',
    method: 'post',
    data: {
      patrol_name: form.patrol_name,
      sr_id: form.sr_id,
      patrol_content: form.patrol_content,
      patrol_rate: form.patrol_rate,
      patrol_man_id: form.patrol_man_id,
      nfc_code: form.nfc_code,
      patrol_type: form.patrol_type,
      patrol_location: form.patrol_location
    }
  })
}

export function editPatrol(form) {
  return request({
    url: '/api/dd/daily/patrol/info/update',
    method: 'post',
    data: {
      id: form.id,
      patrol_name: form.patrol_name,
      sr_id: form.sr_id,
      patrol_content: form.patrol_content,
      patrol_rate: form.patrol_rate,
      patrol_man_id: form.patrol_man_id,
      nfc_code: form.nfc_code,
      patrol_type: form.patrol_type,
      patrol_location: form.patrol_location
    }
  })
}

export function getPatrolDetail(id) {
  return request({
    url: '/api/dd/daily/patrol/info/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function deletePatrol(id) {
  return request({
    url: '/api/dd/daily/patrol/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function bindNFC(id, nfc_code) {
  return request({
    url: '/api/dd/daily/patrol/info/bind',
    method: 'post',
    data: {
      id: id,
      nfc_code: nfc_code
    }
  })
}

export function unbindNFC(id) {
  return request({
    url: '/api/dd/daily/patrol/info/unbind',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getPatrolReport(patrol_id, start_date, end_date, page_num, page_size) {
  return request({
    url: '/api/dd/daily/patrol/report/paginateByPatrolId',
    method: 'post',
    data: {
      patrol_id: patrol_id,
      start_date: start_date,
      end_date: end_date,
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function getPatrolReporList(patrol_id, day, nextday) {
  return request({
    showLoading: false,
    url: '/api/dd/daily/patrol/report/listByPatrolId',
    method: 'post',
    data: {
      patrol_id: patrol_id,
      day: day,
      nextday: nextday
    }
  })
}

// 获取排查台账分页信息列表
export function paginateReport(scl_id, start_date, end_date, patrol_status, page_num, page_size) {
  return request({
    url: '/api/dd/daily/patrol/report/paginate',
    method: 'post',
    data: {
      scl_id: scl_id,
      start_date: start_date,
      end_date: end_date,
      patrol_status: patrol_status,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 排查台账详情
export function getPatrolReportDetail(id) {
  return request({
    url: '/api/dd/daily/patrol/report/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getQrCode(id) {
  return request({
    url: '/api/dd/daily/patrol/info/qrcode',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function exportPatrolExcel(patrol_name, patrol_rate, patrol_type) {
  const data = {
    patrol_name: patrol_name,
    patrol_rate: patrol_rate,
    patrol_type: patrol_type
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/info/patroExcel?'
  let i
  for (i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function getDpCompleteRate(user_name, dp_day_start, dp_day_end) {
  return request({
    url: '/api/dd/daily/patrol/statistics/dpCompleteRateV2',
    method: 'post',
    data: {
      user_name: user_name,
      dp_day_start: dp_day_start,
      dp_day_end: dp_day_end
    }
  })
}

export function getDpCompleteList(user_name, dp_day_start, dp_day_end) {
  return request({
    url: '/api/dd/daily/patrol/statistics/dpCompleteList',
    method: 'post',
    data: {
      user_name: user_name,
      dp_day_start: dp_day_start,
      dp_day_end: dp_day_end
    }
  })
}

export function riskList() {
  return request({
    url: '/api/dd/daily/patrol/info/risk/list',
    method: 'post',
    data: {},
    showLoading: false
  })
}

export function getDpUndoneList(user_name, dp_day_start, dp_day_end) {
  return request({
    url: '/api/dd/daily/patrol/statistics/dpUndoneList',
    method: 'post',
    data: {
      user_name: user_name,
      dp_day_start: dp_day_start,
      dp_day_end: dp_day_end
    }
  })
}

export function getDpProgressList(user_name, dp_day_start, dp_day_end) {
  return request({
    url: '/api/dd/daily/patrol/statistics/dpProgressList',
    method: 'post',
    data: {
      user_name: user_name,
      dp_day_start: dp_day_start,
      dp_day_end: dp_day_end
    }
  })
}

export function exportDpComplete(user_name, dp_day_start, dp_day_end) {
  const data = {
    user_name: user_name,
    dp_day_start: dp_day_start,
    dp_day_end: dp_day_end
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/statistics/exportDpCompleteV2?'
  let i
  for (i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 单个导出巡检卡
export function exportCard(id) {
  const data = {
    id: id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/info/card/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 多个导出巡检卡
export function exportAllCard(patrol_rate, patrol_name) {
  const data = {
    patrol_name: patrol_name,
    patrol_rate: patrol_rate
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/info/card/more?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
