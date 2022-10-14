import request from '@/utils/request'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'

// 日排查统计
export function statisticsDay(month) {
  return request({
    url: '/api/dd/daily/patrol/statistics/day',
    method: 'post',
    data: {
      month: month
    }
  })
}

// 单日排查统计详情
export function statisticsDay_detail(date, user_id) {
  return request({
    url: '/api/dd/daily/patrol/statistics/day/detial',
    method: 'post',
    data: {
      date: date,
      user_id: user_id
    }
  })
}

// 周排查统计
export function statisticsWeek(month) {
  return request({
    url: '/api/dd/daily/patrol/statistics/week',
    method: 'post',
    data: {
      month: month
    }
  })
}

// 周排查详情
export function statisticsWeek_detail(month, week, user_id) {
  return request({
    url: '/api/dd/daily/patrol/statistics/week/detial',
    method: 'post',
    data: {
      month: month,
      week: week,
      user_id: user_id
    }
  })
}

// 月排查统计
export function statisticsYear(year) {
  return request({
    url: '/api/dd/daily/patrol/statistics/month',
    method: 'post',
    data: {
      year: year
    }
  })
}

// 单月排查统计详情
export function statisticsYear_detail(month, user_id) {
  return request({
    url: '/api/dd/daily/patrol/statistics/month/detial',
    method: 'post',
    data: {
      month: month,
      user_id: user_id
    }
  })
}

// 导出
export function exportPatrolExcel(month) {
  const data = {
    month: month
  }
  data['app_id'] = getAppId()
  data['timestamp'] = nowTime()
  data['token'] = getToken()
  data['sign'] = getSign(data)
  let url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/report/export/by/month?'
  for (const i in data) {
    url += i + '=' + data[i] + '&'
  }
  return url
}
