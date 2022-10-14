import request from '@/utils/request'

export function getUserType() {
  return request({
    showLoading: false,
    url: '/api/sys/dic/child/user/type',
    method: 'post',
    data: {}
  })
}

export function getPatrolRrate() {
  return request({
    showLoading: false,
    url: '/api/sys/dic/child/risk/patrolrate',
    method: 'post',
    data: {}
  })
}

export function getPatrolType() {
  return request({
    showLoading: false,
    url: '/api/sys/dic/child/patrol/type',
    method: 'post',
    data: {}
  })
}
