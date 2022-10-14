import request from '@/utils/request'

// 获取列表数据
export function paginate(task_name, task_class_name, task_des, status_flag, create_time_start, create_time_end, page_num, page_size) {
  return request({
    url: '/api/sys/task/paginate',
    method: 'post',
    data: {
      task_name: task_name,
      task_class_name: task_class_name,
      task_des: task_des,
      status_flag: status_flag,
      create_time_start: create_time_start,
      create_time_end: create_time_end,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 添加定时任务
export function addTask(task_name, task_class_name, task_expression, task_des) {
  return request({
    url: '/api/sys/task/save',
    method: 'post',
    data: {
      task_name: task_name,
      task_class_name: task_class_name,
      task_expression: task_expression,
      task_des: task_des
    }
  })
}

// 修改定时任务
export function updateTask(task_id, task_name, task_class_name, task_expression, task_des) {
  return request({
    url: '/api/sys/task/update',
    method: 'post',
    data: {
      task_id: task_id,
      task_name: task_name,
      task_class_name: task_class_name,
      task_expression: task_expression,
      task_des: task_des
    }
  })
}

// 删除定时任务
export function deleteTask(task_id) {
  return request({
    url: '/api/sys/task/delete',
    method: 'post',
    data: {
      task_id: task_id
    }
  })
}

// 停用定时任务
export function disableTask(task_id) {
  return request({
    url: '/api/sys/task/disable',
    method: 'post',
    data: {
      task_id: task_id
    }
  })
}

// 启用定时任务
export function enableTask(task_id) {
  return request({
    url: '/api/sys/task/enable',
    method: 'post',
    data: {
      task_id: task_id
    }
  })
}

// 停用所有定时任务
export function disableOffTask() {
  return request({
    url: '/api/sys/task/off',
    method: 'post',
    data: {}
  })
}

// 启用所有定时任务
export function enableOnTask() {
  return request({
    url: '/api/sys/task/on',
    method: 'post',
    data: {}
  })
}
