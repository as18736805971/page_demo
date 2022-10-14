import request from '@/utils/request'

export function getMenuList() {
  return request({
    url: '/api/sys/menu/list',
    method: 'post',
    data: {}
  })
}

export function getMenu(menu_id) {
  return request({
    url: '/api/sys/menu/info',
    method: 'post',
    data: {
      menu_id: menu_id
    }
  })
}

export function addMenu(form) {
  const data = { ...form }
  return request({
    url: '/api/sys/menu/save',
    method: 'post',
    data: data
  })
}

export function editMenu(menu_id, form) {
  const data = { ...form }
  data['menu_id'] = menu_id
  return request({
    url: '/api/sys/menu/update',
    method: 'post',
    data: data
  })
}

export function deleteMenu(menu_id) {
  return request({
    url: '/api/sys/menu/delete',
    method: 'post',
    data: {
      menu_id: menu_id
    }
  })
}

export function getUnlinkAuth() {
  return request({
    url: '/api/sys/menu/relation/list',
    method: 'post',
    data: {}
  })
}

export function editMenuAuth(menu_id, fp_id) {
  return request({
    url: '/api/sys/menu/relation/update',
    method: 'post',
    data: {
      menu_id: menu_id,
      fp_id: fp_id
    }
  })
}

export function getSelectedAuth(menu_id) {
  return request({
    url: '/api/sys/menu/relation/list/point',
    method: 'post',
    data: {
      menu_id: menu_id
    }
  })
}
