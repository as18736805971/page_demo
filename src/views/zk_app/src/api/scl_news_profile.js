import request from '@/utils/request'
export function getIntroduceDetail() {
  return request({
    url: '/api/source/school/introduce/detail',
    method: 'post',
    data: {
    }
  })
}

export function addIntroduce(scl_intro, index_show) {
  return request({
    url: '/api/source/school/introduce/save',
    method: 'post',
    data: {
      scl_intro: scl_intro,
      index_show: index_show
    }
  })
}
