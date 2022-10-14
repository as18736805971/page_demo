import request from '@/utils/request'

export function getRiskRank(count) {
  return request({
    url: '/api/dd/riskpoint/info/rank',
    method: 'post',
    data: {
      limit: count
    }
  })
}

export function getBuildingInfo(id) {
  return request({
    url: '/api/dd/school/building/risk',
    method: 'post',
    data: {
      scl_id: id
    }
  })
}

export function getBuildingRisk(id) {
  return request({
    url: '/api/dd/school/building/maxrisk',
    method: 'post',
    data: {
      scl_id: id
    }
  })
}

export function getSchoolModel() {
  return request({
    url: '/api/dd/school/info/model',
    method: 'post',
    data: {}
  })
}
