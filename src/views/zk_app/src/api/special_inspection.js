import request from '@/utils/request'

export function info_paginate(search, page, page_size) {
  return request({
    url: '/api/dd/inspection/info/paginate',
    method: 'post',
    data: {
      si_name: search.si_name,
      inspection_status: search.inspection_status,
      start_time: search.start_time,
      end_time: search.end_time,
      page_num: page,
      page_size: page_size
    }
  })
}

export function add_inspection(data) {
  return request({
    url: '/api/dd/inspection/info/save',
    method: 'post',
    data: {
      si_name: data.si_name,
      inspection_type: data.inspection_type,
      start_time: data.start_time,
      end_time: data.end_time,
      pass_score: data.pass_score
    }
  })
}

export function getInspectionInfo(id) {
  return request({
    url: '/api/dd/inspection/info/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function edit_inspection(data, id) {
  return request({
    url: '/api/dd/inspection/info/update',
    method: 'post',
    data: {
      id: id,
      si_name: data.si_name,
      inspection_type: data.inspection_type,
      start_time: data.start_time,
      end_time: data.end_time,
      pass_score: data.pass_score
    }
  })
}

export function delete_inspection(id) {
  return request({
    url: '/api/dd/inspection/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function add_inspection_item(data) {
  return request({
    url: '/api/dd/inspection/item/save',
    method: 'post',
    data: {
      si_id: data.si_id,
      item_title: data.item_title,
      item_content: data.item_content,
      item_score: data.item_score,
      item_score_standrad: data.item_score_standrad
    }
  })
}

export function delete_inspection_item(id) {
  return request({
    url: '/api/dd/inspection/item/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function get_edu_scl() {
  return request({
    url: '/api/dd/edu/school/rel/edulist',
    method: 'post',
    data: {}
  })
}

export function publish_inspection(si_id, scl_id) {
  return request({
    url: '/api/dd/inspection/info/publish',
    method: 'post',
    data: {
      si_id: si_id,
      scl_id: scl_id
    }
  })
}

export function inspection_scl_list(search, page, page_size) {
  return request({
    url: '/api/dd/inspection/range/paginate',
    method: 'post',
    data: {
      scl_id: search.scl_id,
      si_name: search.si_name,
      has_score: search.inspection_status,
      page_num: page,
      page_size: page_size
    }
  })
}

export function get_inspection_detail(si_id, scl_id) {
  return request({
    url: '/api/dd/inspection/range/detail',
    method: 'post',
    data: {
      si_id: si_id,
      scl_id: scl_id
    }
  })
}
export function inspection_score(data) {
  return request({
    url: '/api/dd/inspection/score/score',
    method: 'post',
    data: {
      si_id: data.si_id,
      sii_id: data.sii_id,
      scl_id: data.scl_id,
      score: data.score
    }
  })
}

export function inspection_scl_paginate(search, page, page_size) {
  return request({
    url: '/api/dd/inspection/info/scl/paginate',
    method: 'post',
    data: {
      si_name: search.si_name,
      start_time: search.start_time,
      end_time: search.end_time,
      page_num: page,
      page_size: page_size
    }
  })
}

export function add_report(data) {
  return request({
    url: '/api/dd/inspection/report/save',
    method: 'post',
    data: {
      si_id: data.si_id,
      sii_id: data.sii_id,
      report_content: data.report_content,
      attachment_url: data.attachment_url,
      attachment_name: data.attachment_name,
      attachment_ext: data.attachment_ext
    }
  })
}

export function delete_report(id) {
  return request({
    url: '/api/dd/inspection/report/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function item_report(sii_id) {
  return request({
    url: '/api/dd/inspection/report/detail',
    method: 'post',
    data: {
      sii_id: sii_id
    }
  })
}

export function get_inspection_scl_list(si_id) {
  return request({
    url: '/api/dd/inspection/range/scllist',
    method: 'post',
    data: {
      si_id: si_id
    }
  })
}

export function get_inspection_scl_paginate(si_id, page, page_size) {
  return request({
    url: '/api/dd/inspection/range/sclpaginate',
    method: 'post',
    data: {
      si_id: si_id,
      page_num: page,
      page_size: page_size
    }
  })
}

export function get_inspection_scl_status(si_id) {
  return request({
    url: '/api/dd/inspection/range/passcount',
    method: 'post',
    data: {
      si_id: si_id
    }
  })
}
