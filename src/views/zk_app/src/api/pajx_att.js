import request from '@/utils/request'

export function getAtt(att_time_start, att_time_end, scl_name = '') {
  return request({
    url: '/api/pajx/att/quantity',
    method: 'post',
    data: {
      att_time_start: att_time_start,
      att_time_end: att_time_end,
      scl_name: scl_name
    }
  })
}
