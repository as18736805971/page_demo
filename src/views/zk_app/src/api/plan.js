import request from '@/utils/request'

// 获取应急预案分页列表
export function paginate(plan_type, plan_name, risk_category, page_num, page_size) {
  return request({
    url: '/api/dd/emergency/plan/info/paginate',
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

// 获取应急预案详情
export function gainPlanInfo(id) {
  return request({
    url: '/api/dd/emergency/plan/info/info',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 获取救援队伍列表
export function getGroupList() {
  return request({
    url: '/api/dd/emergency/group/list',
    method: 'post',
    data: {}
  })
}

// 获取救援队伍成员信息
export function getGrouInfo(id) {
  return request({
    url: '/api/dd/emergency/group/member/listMembers',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 为应急预案添加救援队伍
export function saveGroup(emer_id, group_id) {
  return request({
    url: '/api/dd/emergency/plan/group/relation/save',
    method: 'post',
    data: {
      emer_id: emer_id,
      group_id: group_id
    }
  })
}

// 为应急预案删除救援队伍
export function deleteGroup(id) {
  return request({
    url: '/api/dd/emergency/plan/group/relation/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 获取应急预案绑定的救援队伍列表
export function getPlanGroupList(emer_id) {
  return request({
    url: '/api/dd/emergency/plan/group/relation/list',
    method: 'post',
    data: {
      emer_id: emer_id
    }
  })
}

// 新增应急预案
export function savePlan(plan_type, plan_name, plan_content, plan_knowledge, risk_category) {
  return request({
    url: '/api/dd/emergency/plan/info/save',
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

// 获取应急设备列表
export function getEquipment(emer_id) {
  return request({
    url: '/api/dd/emergency/plan/equipment/relation/listequ',
    method: 'post',
    data: {
      emer_id: emer_id
    }
  })
}

// 为应急预案添加应急设备
export function saveEquipment(emer_id, equ_id) {
  return request({
    url: '/api/dd/emergency/plan/equipment/relation/save',
    method: 'post',
    data: {
      emer_id: emer_id,
      equ_id: equ_id
    }
  })
}

// 为应急预案删除应急设备
export function delEquipment(id) {
  return request({
    url: '/api/dd/emergency/plan/equipment/relation/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 为应急预案添加步骤
export function saveSteps(emer_id, step_type, step_content, step_broadcast_url, broadcast_type, step_order, scl_user_id) {
  return request({
    url: '/api/dd/emergency/plan/steps/save',
    method: 'post',
    data: {
      emer_id: emer_id,
      step_type: step_type,
      step_content: step_content,
      step_broadcast_url: step_broadcast_url,
      broadcast_type: broadcast_type,
      step_order: step_order,
      scl_user_id: scl_user_id
    }
  })
}

// 为应急预案删除步骤
export function delteps(id) {
  return request({
    url: '/api/dd/emergency/plan/steps/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 修改应急预案
export function updatePlan(id, plan_type, plan_name, plan_content, plan_knowledge, risk_category) {
  return request({
    url: '/api/dd/emergency/plan/info/update',
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
    url: '/api/dd/emergency/plan/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getPushPeople(id) {
  return request({
    url: '/api/dd/emergency/plan/steps/push',
    method: 'post',
    data: {
      step_id: id
    }
  })
}
