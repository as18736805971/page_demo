import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

// 日排查统计
export function dpSummary(month, scl_id) {
  return request({
    url: '/api/dd/daily/patrol/statistics/dp/summary',
    method: 'post',
    data: {
      month: month,
      scl_id: scl_id
    }
  })
}

// 导出
export function dpSummaryExport(month, scl_id) {
  const data = {
    month: month,
    scl_id: scl_id
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/statistics/dp/summary/export?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
