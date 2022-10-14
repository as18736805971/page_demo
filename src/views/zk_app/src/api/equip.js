import request from '@/utils/request'

// 应急设备分页列表
export function paginate(equipment_name, equipment_status, page_num, page_size) {
  return request({
    url: '/api/dd/emergency/equipment/info/paginate',
    method: 'post',
    data: {
      equipment_name: equipment_name,
      equipment_status: equipment_status,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 新增应急设备
export function saveEquipment(equipment_name, euqipment_count, equipment_location, equipment_status, response_man) {
  return request({
    url: '/api/dd/emergency/equipment/info/save',
    method: 'post',
    data: {
      equipment_name: equipment_name,
      euqipment_count: euqipment_count,
      equipment_location: equipment_location,
      equipment_status: equipment_status,
      response_man: response_man
    }
  })
}

// 修改应急设备
export function updateEquipment(id, equipment_name, euqipment_count, equipment_location, equipment_status, response_man) {
  return request({
    url: '/api/dd/emergency/equipment/info/update',
    method: 'post',
    data: {
      id: id,
      equipment_name: equipment_name,
      euqipment_count: euqipment_count,
      equipment_location: equipment_location,
      equipment_status: equipment_status,
      response_man: response_man
    }
  })
}

// 删除应急设备
export function deleteEquipment(id) {
  return request({
    url: '/api/dd/emergency/equipment/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
