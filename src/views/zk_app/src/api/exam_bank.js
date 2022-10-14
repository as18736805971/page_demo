import request from '@/utils/request'
export function paginate(ques_type, ques_title, page_num, page_size) {
  return request({
    url: '/api/exam/bank/paginate',
    method: 'post',
    data: {
      ques_type: ques_type,
      ques_title: ques_title,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 新增考试试题
export function saveExam(ques_type, ques_title, option_answer, real_answer) {
  return request({
    url: '/api/exam/bank/save',
    method: 'post',
    data: {
      ques_type: ques_type,
      ques_title: ques_title,
      option_answer: option_answer,
      real_answer: real_answer
    }
  })
}

// 更新考试试题
export function updateExam(id, ques_type, ques_title, option_answer, real_answer) {
  return request({
    url: '/api/exam/bank/update',
    method: 'post',
    data: {
      id: id,
      ques_type: ques_type,
      ques_title: ques_title,
      option_answer: option_answer,
      real_answer: real_answer
    }
  })
}

// 删除考试试题
export function delExam(id) {
  return request({
    url: '/api/exam/bank/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
