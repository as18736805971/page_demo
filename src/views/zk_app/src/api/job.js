import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

export function getJobList(job_name, risk_rank, page_num, page_size) {
  return request({
    url: '/api/dd/job/info/paginate',
    method: 'post',
    data: {
      job_name: job_name,
      risk_rank: risk_rank,
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function addJob(form) {
  return request({
    url: '/api/dd/job/info/save',
    method: 'post',
    data: {
      job_name: form.job_name,
      department_id: form.department_id,
      response_department_id: form.response_department_id,
      risk_rank: form.risk_rank,
      remark: form.remark,
      potential_risk: JSON.stringify(form.potential_risk),
      risk_result: JSON.stringify(form.risk_result),
      control_measure: JSON.stringify(form.control_measure),
      emergency_contact: form.emergency_contact,
      risk_id: form.risk_id
    }
  })
}

export function editJob(id, form) {
  return request({
    url: '/api/dd/job/info/update',
    method: 'post',
    data: {
      id: id,
      job_name: form.job_name,
      department_id: form.department_id,
      response_department_id: form.response_department_id,
      risk_rank: form.risk_rank,
      remark: form.remark,
      potential_risk: JSON.stringify(form.potential_risk),
      risk_result: JSON.stringify(form.risk_result),
      control_measure: JSON.stringify(form.control_measure),
      emergency_contact: form.emergency_contact,
      risk_id: form.risk_id
    }
  })
}

export function getJob(id) {
  return request({
    url: '/api/dd/job/info/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function basisType() {
  return request({
    url: '/api/dd/riskpoint/info/relationRisk',
    method: 'post',
    data: {}
  })
}

export function deleteJob(id) {
  return request({
    url: '/api/dd/job/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 生成岗位风险应知应会卡
export function generateJobExport(id) {
  const data = {
    id: id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/job/info/exportWord?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 生成卡
export function exportCard(id) {
  const data = {
    id: id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/job/info/card/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function cardPre(id) {
  return request({
    url: '/api/dd/job/info/risk/card/pre',
    method: 'post',
    data: {
      job_id: id
    }
  })
}

// 生成风险公告
export function exportRiskCard(id) {
  const data = {
    job_id: id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/job/info/risk/card/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function emerPre(id) {
  return request({
    url: '/api/dd/job/info/emergency/card/pre',
    method: 'post',
    data: {
      job_id: id
    }
  })
}

// 生成应急处置卡
export function exportEmerCard(id) {
  const data = {
    job_id: id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/job/info/emergency/card/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 获取图片调整参数
export function getImgCus(id) {
  return request({
    url: '/api/dd/job/info/card/cus',
    method: 'post',
    showLoading: false,
    data: {
      id: id
    }
  })
}

export function getThumbnail(data) {
  return request({
    url: '/api/dd/job/info/card/img',
    method: 'post',
    showLoading: false,
    data: {
      id: data.id,
      font_size: data.font_size,
      potential_risk_line_height: data.potential_risk_line_height,
      risk_result_line_height: data.risk_result_line_height,
      control_measure_line_height: data.control_measure_line_height,
      pre_img_url: data.pre_img_url
    }
  })
}
