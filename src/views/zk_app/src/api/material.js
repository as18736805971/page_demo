import request from '@/utils/request'
import { getAppId, getSign, getToken, nowTime } from '@/utils/auth'

export function paginate(search) {
  return request({
    url: '/api/dd/material/task/paginate',
    method: 'post',
    data: {
      task_no: search.task_no,
      status_flag: search.status_flag,
      page_num: search.page,
      page_size: search.page_size
    }
  })
}

export function taskSave(name) {
  return request({
    url: '/api/dd/material/task/save',
    method: 'post',
    data: {
      name: name
    }
  })
}

export function getMaterialPre(task_id) {
  return request({
    url: '/api/dd/material/task/download/pre',
    method: 'post',
    data: {
      task_id: task_id
    }
  })
}

export function downMaterial(task_id) {
  const data = {
    task_id: task_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/material/task/download?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
