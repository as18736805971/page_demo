import request from '@/utils/request'

export function paginate(is_mine, is_to_me, page, page_size) {
  const data = {
    notice_title: '',
    start_time: '',
    end_time: '',
    page_num: page,
    page_size: page_size
  }
  if (is_mine === '1') {
    data.is_mine = is_mine
  }
  if (is_to_me === '1') {
    data.is_to_me = is_to_me
  }
  return request({
    url: '/api/dd/notice/info/paginate',
    method: 'post',
    data: data
  })
}

export function detail(notice_id) {
  return request({
    url: '/api/dd/notice/info/detail',
    method: 'post',
    data: {
      notice_id: notice_id
    }
  })
}

export function person(notice_id) {
  return request({
    url: '/api/dd/notice/info/detailPerson',
    method: 'post',
    data: {
      notice_id: notice_id
    }
  })
}

export function save(form) {
  return request({
    url: '/api/dd/notice/info/save',
    method: 'post',
    data: {
      notice_title: form.notice_title,
      notice_content: form.notice_content,
      user_id: form.user_id,
      attachment_url: form.attachment_url,
      attachment_name: form.attachment_name,
      attachment_ext: form.attachment_ext
    }
  })
}

export function del(notice_id) {
  return request({
    url: '/api/dd/notice/info/delete',
    method: 'post',
    data: {
      notice_id: notice_id
    }
  })
}
