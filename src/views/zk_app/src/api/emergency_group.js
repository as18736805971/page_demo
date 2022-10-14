import request from '@/utils/request'

// 获取应急小组分页列表
export function paginatelist() {
  return request({
    url: '/api/dd/emergency/group/list',
    method: 'post',
    data: {}
  })
}

// 新增应急小组
export function saveGroup(group_name, group_phone, group_member, leader_id) {
  return request({
    url: '/api/dd/emergency/group/save',
    method: 'post',
    data: {
      group_name: group_name,
      group_phone: group_phone,
      group_member: group_member,
      leader_id: leader_id
    }
  })
}

// 修改应急小组
export function updateGroup(id, group_name, group_phone) {
  return request({
    url: '/api/dd/emergency/group/update',
    method: 'post',
    data: {
      id: id,
      group_name: group_name,
      group_phone: group_phone
    }
  })
}

// 删除应急小组
export function deleteGroup(id) {
  return request({
    url: '/api/dd/emergency/group/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function removeMember(group_id, group_member) {
  return request({
    url: '/api/dd/emergency/group/member/delete',
    method: 'post',
    data: {
      id: group_id,
      group_member: group_member
    }
  })
}

export function setLeader(group_id, leader_id, type) {
  return request({
    url: '/api/dd/emergency/group/member/update',
    method: 'post',
    data: {
      id: group_id,
      leader_id: leader_id,
      is_leader: type
    }
  })
}

export function addTeamMember(group_id, group_member) {
  return request({
    url: '/api/dd/emergency/group/member/save',
    method: 'post',
    data: {
      id: group_id,
      group_member: group_member
    }
  })
}

export function memberNotList(group_id) {
  return request({
    url: '/api/dd/emergency/group/member/listno',
    method: 'post',
    data: {
      id: group_id
    }
  })
}

export function moveorder(id) {
  return request({
    url: '/api/dd/emergency/group/member/moveorder',
    method: 'post',
    data: {
      id: id
    }
  })
}
