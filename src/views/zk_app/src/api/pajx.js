import request from '@/utils/request'

export function getLoginCode() {
  return request({
    url: '/api/pajx/oauth/code',
    method: 'post',
    data: {},
    showLoading: false
  })
}

export function getPajxAttMonth(month_date, single_scl_id = '') {
  return request({
    url: '/api/pajx/att/month/list',
    method: 'post',
    data: {
      month_date: month_date,
      single_scl_id: single_scl_id
    }
  })
}

export function getPajxAtt(search, page_num, page_size) {
  const { att_flag, att_date, pajx_scl_id, stu_name } = search
  return request({
    url: '/api/pajx/att/scl/detail',
    method: 'post',
    data: {
      att_flag: att_flag,
      att_date: att_date,
      pajx_scl_id: pajx_scl_id,
      stu_name: stu_name,
      page_num: page_num,
      page_size: page_size
    }
  })
}
