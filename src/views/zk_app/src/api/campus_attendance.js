import request from '@/utils/request'

// 获取学校班级年级信息-河南
export function classInfo(pajx_scl_id) {
  return request({
    url: '/api/pajx/att/class/info',
    method: 'post',
    data: {
      pajx_scl_id: pajx_scl_id
    }
  })
}

// 获取学校宿舍信息-河南
export function dormInfo(pajx_scl_id) {
  return request({
    url: '/api/pajx/att/dorm/info',
    method: 'post',
    data: {
      pajx_scl_id: pajx_scl_id
    }
  })
}

// 获取学校校门考勤-河南
export function stuGate(pajx_gra_id, pajx_cls_id, stu_name, start_time, end_time, page_num, page_size) {
  return request({
    url: '/api/pajx/att/stu/gate',
    method: 'post',
    data: {
      pajx_gra_id: pajx_gra_id,
      pajx_cls_id: pajx_cls_id,
      stu_name: stu_name,
      start_time: start_time,
      end_time: end_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取学校宿舍考勤-河南
export function stuDorm(pajx_bld_id, pajx_dor_id, stu_name, start_time, end_time, page_num, page_size) {
  return request({
    url: '/api/pajx/att/stu/dorm',
    method: 'post',
    data: {
      pajx_bld_id: pajx_bld_id,
      pajx_dor_id: pajx_dor_id,
      stu_name: stu_name,
      start_time: start_time,
      end_time: end_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取学校未考勤学生列表-河南
export function stuNoatt(pajx_gra_id, pajx_cls_id, stu_name, start_time, end_time, page_num, page_size) {
  return request({
    url: '/api/pajx/att/stu/noatt',
    method: 'post',
    data: {
      pajx_gra_id: pajx_gra_id,
      pajx_cls_id: pajx_cls_id,
      stu_name: stu_name,
      start_time: start_time,
      end_time: end_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取学校学生考勤详情-河南
export function stuDetail(stu_id, start_time, end_time, page_num, page_size) {
  return request({
    url: '/api/pajx/att/stu/detail',
    method: 'post',
    data: {
      stu_id: stu_id,
      start_time: start_time,
      end_time: end_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}
