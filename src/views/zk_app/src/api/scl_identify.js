import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

// 获取风险点辨识列表数据
export function identifyPaginate(data) {
  return request({
    url: '/api/dd/school/risk/paginate',
    method: 'post',
    data: {
      scl_risk_name: data.scl_risk_name,
      risk_no: data.risk_no,
      nfc_code: data.nfc_code,
      page_num: data.page_num,
      page_size: data.page_size
    }
  })
}

export function relationRisk(data) {
  return request({
    url: '/api/dd/riskpoint/info/relationRisk',
    method: 'post',
    data: {}
  })
}

// 风险类型字典
export function riskCategory() {
  return request({
    url: '/api/sys/dic/child/risk/category',
    method: 'post',
    showLoading: false,
    data: {}
  })
}

// 新增风险点辨识
export function saveRisk(data) {
  return request({
    url: '/api/dd/school/risk/save',
    method: 'post',
    showLoading: false,
    data: {
      risk_id: data.risk_id,
      patrol_man_id: data.patrol_man_id,
      scl_risk_name: data.scl_risk_name,
      nfc_code: data.nfc_code,
      patrol_rate: data.patrol_rate,
      patrol_qrcode_num: data.patrol_qrcode_num,
      risk_notice_num: data.risk_notice_num,
      emergency_handle_num: data.emergency_handle_num,
      post_notify_num: data.post_notify_num,
      group_info: data.group_info
    }
  })
}

// 修改风险点辨识
export function updateRisk(data) {
  return request({
    url: '/api/dd/school/risk/update',
    method: 'post',
    showLoading: false,
    data: {
      sr_id: data.id,
      patrol_man_id: data.patrol_man_id,
      risk_id: data.risk_id,
      scl_risk_name: data.scl_risk_name,
      nfc_code: data.nfc_code,
      patrol_rate: data.patrol_rate,
      patrol_id: data.patrol_id,
      patrol_qrcode_num: data.patrol_qrcode_num,
      risk_notice_num: data.risk_notice_num,
      emergency_handle_num: data.emergency_handle_num,
      post_notify_num: data.post_notify_num,
      group_info: data.group_info
    }
  })
}

// 删除风险点辨识
export function deleteRisk(sr_id) {
  return request({
    url: '/api/dd/school/risk/delete',
    method: 'post',
    showLoading: false,
    data: {
      sr_id: sr_id
    }
  })
}

export function patrolMan() {
  return request({
    url: '/api/dd/school/user/normal',
    method: 'post',
    showLoading: false,
    data: {}
  })
}

// 风险点辨识详情
export function gainRiskDetail(sr_id) {
  return request({
    url: '/api/dd/school/risk/detail',
    method: 'post',
    data: {
      sr_id: sr_id
    }
  })
}

// 获取设施风险点
export function gainBuildingList() {
  return request({
    url: '/api/dd/school/building/list',
    method: 'post',
    data: {}
  })
}

// 获取活动风险
export function gainActivityList() {
  return request({
    url: '/api/dd/school/activity/list',
    method: 'post',
    data: {}
  })
}

// 获取风险模型
export function gainModelList() {
  return request({
    url: '/api/dd/riskpoint/model/list',
    method: 'post',
    data: {}
  })
}
/** **
 *
 * 风险点评估
 */

// 获取风险点评估列表数据
export function estimatePaginate(risk_type, risk_category, risk_name, is_estimate, page_num, page_size) {
  return request({
    url: '/api/dd/riskpoint/estimate/paginate',
    method: 'post',
    data: {
      risk_type: risk_type,
      risk_category: risk_category,
      risk_name: risk_name,
      is_estimate: is_estimate,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 风险点评估
export function riskEstimate(risk_id, estimate_type, estmate_result) {
  return request({
    url: '/api/dd/riskpoint/estimate/save',
    method: 'post',
    data: {
      risk_id: risk_id,
      estimate_type: estimate_type,
      estmate_result: estmate_result
    }
  })
}

// 风险点评估详情
export function gainEstimateDetail(risk_id) {
  return request({
    url: '/api/dd/riskpoint/estimate/detail',
    method: 'post',
    data: {
      risk_id: risk_id
    }
  })
}

/** **
 *
 * 风险点管控
 */

// 获取风险点管控列表数据
export function controlPaginate(scl_id, risk_type, risk_category, risk_name, risk_rank, has_measures, page_num, page_size) {
  return request({
    url: '/api/dd/riskpoint/measures/paginate',
    method: 'post',
    data: {
      scl_id: scl_id,
      risk_type: risk_type,
      risk_category: risk_category,
      risk_name: risk_name,
      risk_rank: risk_rank,
      has_measures: has_measures,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 添加风险点责任人和责任部门
export function saveRiskResponse(id, control_level, responsible_dept, responsible_man, remaining_risk, icon_id) {
  return request({
    url: '/api/dd/riskpoint/info/responsible',
    method: 'post',
    data: {
      id: id,
      control_level: control_level,
      responsible_dept: responsible_dept,
      responsible_man: responsible_man,
      remaining_risk: remaining_risk,
      icon_id: icon_id
    }
  })
}

// 获取该风险点下的管控措施列表
export function getMeasuresList(risk_id, measures_type) {
  return request({
    url: '/api/dd/riskpoint/measures/list',
    method: 'post',
    data: {
      risk_id: risk_id,
      measures_type: measures_type
    }
  })
}

// 添加风险点管控
export function saveMeasures(risk_id, risk_category, measures_type, measures_title, measures_content, response_man, attachment_url, attachment_name, attachment_ext) {
  return request({
    url: '/api/dd/riskpoint/measures/save',
    method: 'post',
    data: {
      risk_id: risk_id,
      risk_category: risk_category,
      measures_type: measures_type,
      measures_title: measures_title,
      measures_content: measures_content,
      response_man: response_man,
      attachment_url: attachment_url,
      attachment_name: attachment_name,
      attachment_ext: attachment_ext
    }
  })
}

// 修改风险点管控
export function updateMeasures(id, risk_category, measures_title, risk_id, measures_type, measures_content, response_man) {
  return request({
    url: '/api/dd/riskpoint/measures/update',
    method: 'post',
    data: {
      id: id,
      risk_category: risk_category,
      measures_title: measures_title,
      risk_id: risk_id,
      measures_type: measures_type,
      measures_content: measures_content,
      response_man: response_man
    }
  })
}

// 删除风险点管控
export function deleteMeasures(id) {
  return request({
    url: '/api/dd/riskpoint/measures/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 获取该风险点下的管控措施附件列表
export function getMeasuresAttach(risk_id, measures_type) {
  return request({
    url: '/api/dd/riskpoint/measures/attach/list',
    method: 'post',
    data: {
      risk_id: risk_id,
      measures_type: measures_type
    }
  })
}

// 新增管控措施附件
export function saveMeasuresAttach(risk_id, attachment_name, attachment_url, attachment_ext, measures_type) {
  return request({
    url: '/api/dd/riskpoint/measures/attach/save',
    method: 'post',
    data: {
      risk_id: risk_id,
      attachment_name: attachment_name,
      attachment_url: attachment_url,
      attachment_ext: attachment_ext,
      measures_type: measures_type
    }
  })
}

// 删除管控措施附件
export function deleteMeasuresAttach(id) {
  return request({
    url: '/api/dd/riskpoint/measures/attach/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 生成日常巡检计划
export function dailypatrol(measure_id, patrol_rate) {
  return request({
    url: '/api/dd/riskpoint/measures/dailypatrol',
    method: 'post',
    data: {
      measure_id: measure_id,
      patrol_rate: patrol_rate
    }
  })
}

// 风险点管控详情
export function gainControlDetail(risk_id) {
  return request({
    url: '/api/dd/riskpoint/info/inventory/detail',
    method: 'post',
    data: {
      risk_id: risk_id
    }
  })
}

// 风险巡检频率字典
export function riskPatrolrate() {
  return request({
    url: '/api/sys/dic/child/risk/patrolrate',
    method: 'post',
    data: {}
  })
}

// 获取该风险点下的应急措施列表
export function getEmergencyrelation(risk_id) {
  return request({
    url: '/api/dd/riskpoint/measures/emergencyrelation/list',
    method: 'post',
    data: {
      risk_id: risk_id
    }
  })
}

// 获取所有应急预案
export function getPlanList(risk_category, plan_type, plan_name) {
  return request({
    url: '/api/dd/emergency/plan/info/list',
    method: 'post',
    data: {
      risk_category: risk_category,
      plan_type: plan_type,
      plan_name: plan_name
    }
  })
}

// 新增应急风险管控措施
export function addEmergencyrelation(risk_id, risk_category, emer_id) {
  return request({
    url: '/api/dd/riskpoint/measures/emergencyrelation/save',
    method: 'post',
    data: {
      risk_id: risk_id,
      risk_category: risk_category,
      emer_id: emer_id
    }
  })
}

// 删除应急风险管控措施
export function delEmergencyrelation(id) {
  return request({
    url: '/api/dd/riskpoint/measures/emergencyrelation/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
/** **
 *
 * 风险点模板
 */

// 获取风险点模板列表数据
export function modelPaginate(risk_type, risk_category, risk_name, page_num, page_size) {
  return request({
    url: '/api/dd/riskpoint/model/paginate',
    method: 'post',
    data: {
      risk_type: risk_type,
      risk_category: risk_category,
      risk_name: risk_name,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 新增风险点模板
export function saveModelRisk(risk_type, risk_name, risk_category, potential_risk, risk_result, risk_according) {
  return request({
    url: '/api/dd/riskpoint/model/save',
    method: 'post',
    data: {
      risk_type: risk_type,
      risk_name: risk_name,
      risk_category: risk_category,
      potential_risk: potential_risk,
      risk_result: risk_result,
      risk_according: risk_according
    }
  })
}

// 修改风险点模板
export function updateModelRisk(Id, risk_name, risk_type, risk_category, potential_risk, risk_result, risk_according) {
  return request({
    url: '/api/dd/riskpoint/model/update',
    method: 'post',
    data: {
      id: Id,
      risk_name: risk_name,
      risk_type: risk_type,
      risk_category: risk_category,
      potential_risk: potential_risk,
      risk_result: risk_result,
      risk_according: risk_according
    }
  })
}

// 删除风险点模板
export function deleteModelRisk(model_id) {
  return request({
    url: '/api/dd/riskpoint/model/delete',
    method: 'post',
    data: {
      model_id: model_id
    }
  })
}

// 获取风险点模板详情
export function gainRiskModelDetail(model_id) {
  return request({
    url: '/api/dd/riskpoint/model/detail',
    method: 'post',
    data: {
      model_id: model_id
    }
  })
}

// 生成风险公告
export function generateNotice(risk_id, type) {
  const data = {
    risk_relation_id: risk_id,
    risk_type: type
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/riskpoint/info/notice/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
export function getNotice(risk_id, type) {
  return request({
    showLoading: false,
    url: '/api/dd/riskpoint/info/notice/pre',
    method: 'post',
    data: {
      risk_relation_id: risk_id,
      risk_type: type
    }
  })
}

// 生成事故处置应急卡
export function generatePlanInfo(risk_id, type) {
  const data = {
    risk_relation_id: risk_id,
    risk_type: type
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/riskpoint/measures/export/card/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
export function getPlanInfo(risk_id, type) {
  return request({
    showLoading: false,
    url: '/api/dd/riskpoint/measures/export/pre',
    method: 'post',
    data: {
      risk_relation_id: risk_id,
      risk_type: type
    }
  })
}

// 获取风险告知卡内容
export function getNotifycard(risk_no) {
  return request({
    url: '/api/dd/riskpoint/info/notify/card',
    method: 'post',
    data: {
      risk_no: risk_no
    }
  })
}

export function getPatrol(data) {
  return request({
    url: '/api/dd/daily/patrol/info/h5/list',
    method: 'post',
    data: {
      risk_no: data.risk_no
    }
  })
}

// 单个导出巡检卡
export function exportCard(facility_id) {
  const data = {
    facility_id: facility_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/school/facility/info/card/one?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 多个导出巡检卡
export function exportAllCard(facility_location, facility_no) {
  const data = {
    facility_location: facility_location,
    facility_no: facility_no
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/school/facility/info/card/more?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

// 绑定ufc
export function bindNFC(sr_id, nfc_code) {
  return request({
    url: '/api/dd/school/risk/bdNfc',
    method: 'post',
    showLoading: false,
    data: {
      sr_id: sr_id,
      nfc_code: nfc_code
    }
  })
}

export function unbindNFC(sr_id) {
  return request({
    url: '/api/dd/school/risk/deleteNfc',
    method: 'post',
    showLoading: false,
    data: {
      sr_id: sr_id
    }
  })
}

export function getQrCode(sr_id) {
  return request({
    url: '/api/dd/riskpoint/info/qrcode',
    method: 'post',
    showLoading: false,
    data: {
      sr_id: sr_id
    }
  })
}

// 获取图片调整参数
export function getImgCus(risk_id) {
  return request({
    url: '/api/dd/riskpoint/info/notice/cus',
    method: 'post',
    showLoading: false,
    data: {
      risk_id: risk_id
    }
  })
}

export function getThumbnail(data) {
  return request({
    url: '/api/dd/riskpoint/info/notice/img',
    method: 'post',
    showLoading: false,
    data: {
      risk_id: data.risk_id,
      font_size: data.font_size,
      potential_risk_line_height: data.potential_risk_line_height,
      risk_measure_control_line_height: data.risk_measure_control_line_height,
      risk_emergency_line_height: data.risk_emergency_line_height,
      pre_img_url: data.pre_img_url
    }
  })
}

export function getEmergencyCus(risk_id) {
  return request({
    url: '/api/dd/riskpoint/measures/export/card/cus',
    method: 'post',
    showLoading: false,
    data: {
      risk_id: risk_id
    }
  })
}

export function getEmergencyThumbnail(risk_result_param) {
  return request({
    url: '/api/dd/riskpoint/measures/export/card/img',
    method: 'post',
    showLoading: false,
    data: {
      risk_result_param: risk_result_param
    }
  })
}

// 风险点巡检码
export function inspectionCode(sr_id) {
  const data = {
    sr_id: sr_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/school/risk/patrol/card?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
