import request from '@/utils/request'
export function paginate(scl_id, acc_name, page_num, page_size) {
  return request({
    url: '/api/dd/accident/report/paginate',
    method: 'post',
    data: {
      scl_id: scl_id,
      acc_name: acc_name,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 添加批示
export function submitAccident(acc_id, handle_result, finish_result) {
  return request({
    url: '/api/dd/accident/report/instruct',
    method: 'post',
    data: {
      acc_id: acc_id,
      handle_result,
      finish_result
    }
  })
}
