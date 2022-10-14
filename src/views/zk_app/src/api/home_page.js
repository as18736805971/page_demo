import request from '@/utils/request'

// 查询巡查记录(默认查询今日)
export function getPatrolreport() {
  return request({
    url: '/api/dd/daily/patrol/report/today',
    method: 'post',
    data: {}
  })
}

// 获取该日巡检点巡查统计
export function getStatistic(patrol_rate) {
  return request({
    url: '/api/dd/daily/patrol/report/statistic/day/rate',
    method: 'post',
    data: {
      patrol_rate: patrol_rate,
      search_day: ''
    }
  })
}

// 今日上报隐患统计
export function getDangerToday(search_day) {
  return request({
    url: '/api/dd/hidden/danger/info/statistic/today',
    method: 'post',
    data: {
      search_day: search_day
    }
  })
}

// 隐患处理统计
export function gethandle() {
  return request({
    url: '/api/dd/hidden/danger/info/statistic/handle',
    method: 'post',
    data: {}
  })
}

// 该年份下的隐患类型排名列表（默认取今年）
export function getDangerRank(search_year, basis) {
  return request({
    url: '/api/dd/hidden/danger/info/statistic/rank/general',
    method: 'post',
    data: {
      search_year: search_year,
      basis: basis
    }
  })
}

// 该年份下的隐患类型排名列表（默认取今年）
export function getYearhidden(search_year) {
  return request({
    url: '/api/dd/hidden/danger/info/statistic/yearhidden',
    method: 'post',
    data: {
      search_year: search_year
    }
  })
}

// 获取风险等级统计信息
export function getRiskpointRank() {
  return request({
    url: '/api/dd/riskpoint/info/statistic/rank',
    method: 'post',
    data: {}
  })
}

// 应急演练情况统计
export function gettrain() {
  return request({
    url: '/api/dd/emergency/plan/info/statistic/train/edu',
    method: 'post',
    data: {}
  })
}

// 隐患实时上报统计接口
export function getListeduDanger() {
  return request({
    url: '/api/dd/hidden/danger/info/listEdu',
    method: 'post',
    data: {}
  })
}

// 学校隐患数据统计[柱状图]
export function getSchoolhidden() {
  return request({
    url: '/api/dd/hidden/danger/info/statistic/schoolhidden',
    method: 'post',
    data: {}
  })
}

// 今日考勤详情
export function getPajxQuantity(scl_name, att_time_start, att_time_end) {
  return request({
    url: '/api/pajx/att/quantity',
    method: 'post',
    data: {
      pajx_scl_name: scl_name,
      att_time_start: att_time_start,
      att_time_end: att_time_end
    }
  })
}

// 大屏显示今日与昨日考勤人数比
export function getPajxHourlist(today_date) {
  return request({
    url: '/api/pajx/att/hour/list',
    method: 'post',
    data: {
      today_date: today_date
    }
  })
}

// 学校大屏显示考勤统计
export function getAttPreview() {
  return request({
    url: '/api/pajx/att/preview',
    method: 'post',
    data: {}
  })
}

// 学校大屏实时考勤
export function getAttRealtime() {
  return request({
    url: '/api/pajx/att/realtime',
    method: 'post',
    data: {}
  })
}

// 学校大屏获取师生人数(有平安家校)
export function getStuandteaCount() {
  return request({
    url: '/api/pajx/scl/stuandtea/count',
    method: 'post',
    data: {}
  })
}

// 各校每日巡检完成统计
export function getStatisticRank() {
  return request({
    url: '/api/dd/hidden/danger/info/statistic/rank',
    method: 'post',
    data: {}
  })
}

// 各校巡检完成率排行
export function getStatisticTrain() {
  return request({
    url: '/api/dd/emergency/plan/info/statistic/train',
    method: 'post',
    data: {}
  })
}

// 根据学校获取绑定模块
export function getSchoolScmo() {
  return request({
    url: '/api/dd/scmo/school/queryModule',
    method: 'post',
    data: {}
  })
}

// 根据学校获取绑定模块
export function getStatisticsPatrolType(patrol_type) {
  return request({
    url: '/api/dd/daily/patrol/report/statisticsPatrolType',
    method: 'post',
    data: {
      patrol_type: patrol_type
    }
  })
}

