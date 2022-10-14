import request from '@/utils/request'

// 获取列表数据
export function paginate(album_name, start_time, page_num, page_size) {
  return request({
    url: '/api/source/school/album/paginate',
    method: 'post',
    data: {
      album_name: album_name,
      start_time: start_time,
      page_num: page_num,
      page_size: page_size
    }
  })
}

// 添加学校安全相册
export function saveAlbum(album_name, album_desc, album_pic_url) {
  return request({
    url: '/api/source/school/album/save',
    method: 'post',
    data: {
      album_name: album_name,
      album_desc: album_desc,
      album_pic_url: album_pic_url
    }
  })
}

// 修改学校安全相册
export function updateAlbum(id, album_name, album_desc, album_pic_url) {
  return request({
    url: '/api/source/school/album/update',
    method: 'post',
    data: {
      id: id,
      album_name: album_name,
      album_desc: album_desc,
      album_pic_url: album_pic_url
    }
  })
}

// 删除学校安全相册
export function delAlbum(id) {
  return request({
    url: '/api/source/school/album/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 删除学校安全相册单张照片
export function deleteByPicId(pic_id) {
  return request({
    url: '/api/source/school/album/deleteByPicId',
    method: 'post',
    data: {
      pic_id: pic_id
    }
  })
}
