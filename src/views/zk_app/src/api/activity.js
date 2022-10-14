import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { activity_name, activity_type } = search
  return request({
    url: '/api/dd/school/activity/paginate',
    method: 'post',
    data: {
      activity_name: activity_name,
      activity_type: activity_type,
      page_num: page,
      page_size: page_size
    }
  })
}

export function detail(id) {
  return request({
    url: '/api/dd/school/activity/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function save(form) {
  return request({
    url: '/api/dd/school/activity/save',
    method: 'post',
    data: {
      activity_name: form.activity_name,
      location_id: form.location_id,
      activity_content: form.activity_content,
      activity_type: form.activity_type
    }
  })
}

export function update(id, form) {
  return request({
    url: '/api/dd/school/activity/update',
    method: 'post',
    data: {
      id: id,
      activity_name: form.activity_name,
      location_id: form.location_id,
      activity_content: form.activity_content,
      activity_type: form.activity_type
    }
  })
}

export function del(id) {
  return request({
    url: '/api/dd/school/activity/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
