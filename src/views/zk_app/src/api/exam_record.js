import request from '@/utils/request'
export function paginate(exam_status, exam_name, exam_begin_time, exam_end_time, page_num, page_size) {
  return request({
    url: '/api/exam/org/paginate',
    method: 'post',
    data: {
      exam_status: exam_status,
      exam_name: exam_name,
      exam_begin_time: exam_begin_time,
      exam_end_time: exam_end_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 新增考试信息
export function saveExamOrg(exam_name, total_num, pass_standard, limit_time, exam_begin_time, exam_end_time, exam_repeat_flag, exam_person_id) {
  return request({
    url: '/api/exam/org/save',
    method: 'post',
    data: {
      exam_name: exam_name,
      total_num: total_num,
      pass_standard: pass_standard,
      limit_time: limit_time,
      exam_begin_time: exam_begin_time,
      exam_end_time: exam_end_time,
      exam_repeat_flag: exam_repeat_flag,
      exam_person_id: exam_person_id
    }
  })
}

// 修改考试信息
export function updateExamOrg(id, exam_name, total_num, pass_standard, limit_time, exam_begin_time, exam_end_time, exam_repeat_flag) {
  return request({
    url: '/api/exam/org/update',
    method: 'post',
    data: {
      id: id,
      exam_name: exam_name,
      total_num: total_num,
      pass_standard: pass_standard,
      limit_time: limit_time,
      exam_begin_time: exam_begin_time,
      exam_end_time: exam_end_time,
      exam_repeat_flag
    }
  })
}

// 考试详情
export function detailExamOrg(org_exam_id) {
  return request({
    url: '/api/exam/org/detail',
    method: 'post',
    data: {
      org_exam_id: org_exam_id
    }
  })
}

// 删除考试信息
export function delExamOrg(org_exam_id) {
  return request({
    url: '/api/exam/org/delete',
    method: 'post',
    data: {
      org_exam_id: org_exam_id
    }
  })
}

// 添加考试人员
export function addperson(id, exam_person_id) {
  return request({
    url: '/api/exam/org/addperson',
    method: 'post',
    data: {
      id: id,
      exam_person_id: exam_person_id
    }
  })
}

// 发布考试
export function publishExam(org_exam_id) {
  return request({
    url: '/api/exam/org/publish',
    method: 'post',
    data: {
      org_exam_id: org_exam_id
    }
  })
}

// 查看考试成绩单
export function exambank(org_exam_id) {
  return request({
    url: '/api/exam/org/exambank',
    method: 'post',
    data: {
      org_exam_id: org_exam_id
    }
  })
}

// 查看考试成绩单
export function banklist(exam_person_id) {
  return request({
    url: '/api/exam/person/banklist',
    method: 'post',
    data: {
      exam_person_id: exam_person_id
    }
  })
}

// 获取学校的人员列表
export function orgUserlist() {
  return request({
    url: '/api/exam/org/userList',
    method: 'post',
    data: {}
  })
}

// 获取参与考试的人员列表
export function joinlist(org_exam_id) {
  return request({
    url: '/api/exam/org/joinlist',
    method: 'post',
    data: {
      org_exam_id: org_exam_id
    }
  })
}

// 获取字典-考试限时时间
export function getLimitTime() {
  return request({
    url: '/api/sys/dic/child/limit/time',
    method: 'post',
    data: {}
  })
}

// 获取字典-考试题目总数
export function getTotalNum() {
  return request({
    url: '/api/sys/dic/child/total/num',
    method: 'post',
    data: {}
  })
}

