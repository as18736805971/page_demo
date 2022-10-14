import request from '@/utils/request'
export function paginate(acc_name, submit_status, begin_time, end_time, page_num, page_size) {
  return request({
    url: '/api/dd/accident/report/paginate',
    method: 'post',
    data: {
      acc_name: acc_name,
      submit_status: submit_status,
      begin_time: begin_time,
      end_time: end_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 上报事故
export function saveAccident(acc_name, acc_place, occurrence_time, money_lost, people_lost, acc_reason, acc_progress, acc_lost, attachment_url, attachment_name, attachment_ext) {
  return request({
    url: '/api/dd/accident/report/save',
    method: 'post',
    data: {
      acc_name: acc_name,
      acc_place: acc_place,
      occurrence_time: occurrence_time,
      money_lost: money_lost,
      people_lost: people_lost,
      acc_reason: acc_reason,
      acc_progress: acc_progress,
      acc_lost: acc_lost,
      attachment_url: attachment_url,
      attachment_name: attachment_name,
      attachment_ext: attachment_ext
    }
  })
}

// 修改事故信息
export function updateAccident(acc_id, acc_name, acc_place, occurrence_time, money_lost, people_lost, acc_reason, acc_progress, acc_lost) {
  return request({
    url: '/api/dd/accident/report/update',
    method: 'post',
    data: {
      acc_id: acc_id,
      acc_name: acc_name,
      acc_place: acc_place,
      occurrence_time: occurrence_time,
      money_lost: money_lost,
      people_lost: people_lost,
      acc_reason: acc_reason,
      acc_progress: acc_progress,
      acc_lost: acc_lost
    }
  })
}

// 事故详情
export function detailAccident(acc_id) {
  return request({
    url: '/api/dd/accident/report/detail',
    method: 'post',
    data: {
      acc_id: acc_id
    }
  })
}

// 上报教育局
export function submitAccident(acc_id) {
  return request({
    url: '/api/dd/accident/report/submit',
    method: 'post',
    data: {
      acc_id: acc_id
    }
  })
}

// 添加事故附件
export function addAttachment(acc_id, attachment_url, attachment_name, attachment_ext) {
  return request({
    url: '/api/dd/accident/report/attachment/save',
    method: 'post',
    data: {
      acc_id: acc_id,
      attachment_url: attachment_url,
      attachment_name: attachment_name,
      attachment_ext: attachment_ext
    }
  })
}

// 删除附件
export function deleteAttach(attach_id) {
  return request({
    url: '/api/dd/accident/report/attachment/delete',
    method: 'post',
    data: {
      attach_id: attach_id
    }
  })
}

// 删除事故
export function delAccident(acc_id) {
  return request({
    url: '/api/dd/accident/report/delete',
    method: 'post',
    data: {
      acc_id: acc_id
    }
  })
}
