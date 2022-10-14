import request from '@/utils/request'

export function getArea(area_pcode) {
  return request({
    showLoading: false,
    url: '/api/sys/area/list',
    method: 'post',
    data: {
      area_pcode: area_pcode
    }
  })
}
