import request from '@/utils/request'

// 获取校园文件库文件列表
export function paginate(file_category, file_name, page_num, page_size) {
  return request({
    url: '/api/dd/school/file/library/info/paginate',
    method: 'post',
    data: {
      file_category: file_category,
      file_name: file_name,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 获取文件分类类型
export function category() {
  return request({
    url: '/api/sys/dic/child/file/category',
    method: 'post',
    data: {}
  })
}

// 添加文件
export function saveLibrary(file_category, file_url, file_name, file_ext) {
  return request({
    url: '/api/dd/school/file/library/info/save',
    method: 'post',
    data: {
      file_category: file_category,
      file_url: file_url,
      file_name: file_name,
      file_ext: file_ext
    }
  })
}

// 删除文件
export function deleteLibrary(id) {
  return request({
    url: '/api/dd/school/file/library/info/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 获取上传文件到阿里云的key
export function getaccessKey() {
  let data = sessionStorage.getItem('accessData')
  if (data) {
    data = JSON.parse(data)
    const now = Date.parse(new Date())
    if (now - data.time > 3600000) {
      return getAccessKeyRequest()
    } else {
      return new Promise((resolve, reject) => {
        resolve(data.data)
      })
    }
  } else {
    return getAccessKeyRequest()
  }
}

async function getAccessKeyRequest() {
  const result = await request({
    url: '/api/dd/school/file/library/info/accessKey',
    method: 'post',
    data: {}
  })
  const now = Date.parse(new Date())
  const accessData = {
    time: now,
    data: result
  }
  sessionStorage.setItem('accessData', JSON.stringify(accessData))
  return result
}
