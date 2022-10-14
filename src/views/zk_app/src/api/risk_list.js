import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { risk_category, risk_name } = search
  return request({
    url: '/api/dd/riskpoint/info/inventory',
    method: 'post',
    data: {
      risk_category: risk_category,
      risk_name: risk_name,
      page_num: page,
      page_size: page_size
    }
  })
}

export function detail(id) {
  return request({
    url: '/api/dd/riskpoint/info/inventory/detail',
    method: 'post',
    data: {
      risk_id: id
    }
  })
}
