import request from '@/utils/request'

// 获取应急预案分页列表
export function paginate(plan_type, plan_name, risk_category, page_num, page_size) {
  return request({
    url: '/api/dd/emergency/plan/model/paginate',
    method: 'post',
    data: {
      plan_type: plan_type,
      plan_name: plan_name,
      risk_category: risk_category,
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function getModellist() {
  return request({
    url: '/api/dd/emergency/plan/model/list',
    method: 'post',
    data: {}
  })
}

// 获取应急预案详情
export function gainPlanInfo(id) {
  return request({
    url: '/api/dd/emergency/plan/model/info',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 新增应急预案
export function savePlan(plan_type, plan_name, plan_content, plan_knowledge, risk_category) {
  return request({
    url: '/api/dd/emergency/plan/model/save',
    method: 'post',
    data: {
      plan_type: plan_type,
      plan_name: plan_name,
      plan_content: plan_content,
      plan_knowledge: plan_knowledge,
      risk_category: risk_category
    }
  })
}

// 修改应急预案
export function updatePlan(id, plan_type, plan_name, plan_content, plan_knowledge, risk_category) {
  return request({
    url: '/api/dd/emergency/plan/model/update',
    method: 'post',
    data: {
      id: id,
      plan_type: plan_type,
      plan_name: plan_name,
      plan_content: plan_content,
      plan_knowledge: plan_knowledge,
      risk_category: risk_category
    }
  })
}

// // 删除应急预案
export function deletePlan(id) {
  return request({
    url: '/api/dd/emergency/plan/model/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
