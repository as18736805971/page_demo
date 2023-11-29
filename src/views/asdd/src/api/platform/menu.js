import request from '@/utils/request'

export function getTree() {
  return request({
    url: 'api/sys/menu/tree',
    method: 'post'
  })
}

export function getAppList() {
  return request({
    url: 'api/sys/app/list',
    method: 'post'
  })
}
