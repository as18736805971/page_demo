import request from '@/utils/request'

export function getBuildingList() {
  return request({
    url: '/api/dd/school/building/list',
    method: 'post',
    data: {}
  })
}

export function addBuilding(form) {
  return request({
    url: '/api/dd/school/building/save',
    method: 'post',
    data: {
      building_type: form.building_type,
      building_struct: form.building_struct,
      building_safety_level: form.building_safety_level,
      building_name: form.building_name,
      building_area: form.building_area,
      floor_count: form.floor_count,
      floor_height: form.floor_height,
      building_height: form.building_height,
      building_time: form.building_time,
      teacher_count: form.teacher_count,
      student_count: form.student_count,
      stairs_count: form.stairs_count,
      lift_count: form.lift_count,
      building_function: form.building_function,
      bind_model_name: form.bind_model_name,
      parent_id: form.parent_id,
      model_url: form.model_url,
      label_offset_x: form.label_offset_x,
      label_offset_y: form.label_offset_y,
      label_offset_z: form.label_offset_z
    }
  })
}

export function updateBuilding(id, form) {
  return request({
    url: '/api/dd/school/building/update',
    method: 'post',
    data: {
      id: id,
      building_type: form.building_type,
      building_struct: form.building_struct,
      building_safety_level: form.building_safety_level,
      building_name: form.building_name,
      building_area: form.building_area,
      floor_count: form.floor_count,
      floor_height: form.floor_height,
      building_height: form.building_height,
      building_time: form.building_time,
      teacher_count: form.teacher_count,
      student_count: form.student_count,
      stairs_count: form.stairs_count,
      lift_count: form.lift_count,
      building_function: form.building_function,
      bind_model_name: form.bind_model_name,
      parent_id: form.parent_id,
      model_url: form.model_url,
      label_offset_x: form.label_offset_x,
      label_offset_y: form.label_offset_y,
      label_offset_z: form.label_offset_z
    }
  })
}

export function deleteBuilding(id) {
  return request({
    url: '/api/dd/school/building/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function bindBuilding(id, bind_model_name) {
  return request({
    url: '/api/dd/school/building/bind',
    method: 'post',
    data: {
      id: id,
      bind_model_name: bind_model_name
    }
  })
}

export function getBuildingDetail(id) {
  return request({
    url: '/api/dd/school/building/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getBuildRisk(id) {
  return request({
    url: '/api/dd/school/building/buildrisk',
    method: 'post',
    data: {
      id: id
    }
  })
}

