import request from '@/utils/request'
import { getAppId, getSign, getToken, nowTime } from '@/utils/auth'

export function paginate(page_num, page_size) {
  return request({
    url: '/api/dd/batch/risk/paginate',
    method: 'post',
    data: {
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function detail(task_id) {
  return request({
    url: '/api/dd/batch/info',
    method: 'post',
    data: {
      task_id: task_id
    }
  })
}

export function patrol_paginate(page_num, page_size) {
  return request({
    url: '/api/dd/batch/patrol/paginate',
    method: 'post',
    data: {
      page_num: page_num,
      page_size: page_size
    }
  })
}

export function download(task_id) {
  const data = {
    task_id: task_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/batch/download?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}

export function batchDel(task_id) {
  return request({
    url: '/api/dd/batch/delete',
    method: 'post',
    data: {
      task_id: task_id
    }
  })
}
