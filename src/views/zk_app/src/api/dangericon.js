import request from '@/utils/request'

// 获取警示标志分页
export function Paginate(icon_name, page_num, page_size) {
  return request({
    url: '/api/dd/riskpoint/dangericon/paginate',
    method: 'post',
    data: {
      icon_name: icon_name,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取所有警示标志
export function getIconList() {
  return request({
    url: '/api/dd/riskpoint/dangericon/list',
    method: 'post',
    data: {}
  })
}

// 新增警示标志
export function saveDangericon(icon_name, icon_url, keyword) {
  return request({
    url: '/api/dd/riskpoint/dangericon/save',
    method: 'post',
    data: {
      icon_name: icon_name,
      icon_url: icon_url,
      keyword: keyword
    }
  })
}

// 修改警示标志
export function updateDangericon(id, icon_name, icon_url, keyword) {
  return request({
    url: '/api/dd/riskpoint/dangericon/update',
    method: 'post',
    data: {
      id: id,
      icon_name: icon_name,
      icon_url: icon_url,
      keyword: keyword
    }
  })
}

// 删除警示标志
export function deleteDangericon(icon_id) {
  return request({
    url: '/api/dd/riskpoint/dangericon/delete',
    method: 'post',
    data: {
      icon_id: icon_id
    }
  })
}

// 获取警示标志详情
export function gaindangericonDetail(icon_id) {
  return request({
    url: '/api/dd/riskpoint/dangericon/detail',
    method: 'post',
    data: {
      icon_id: icon_id
    }
  })
}
