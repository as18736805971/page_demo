import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { category_name } = search
  return request({
    url: '/api/source/school/article/category/paginate',
    method: 'post',
    data: {
      category_name: category_name,
      page_num: page,
      page_size: page_size
    }
  })
}

export function getCategoryList() {
  return request({
    url: '/api/source/school/article/category/list',
    method: 'post',
    data: {}
  })
}

export function addCategory(form) {
  return request({
    url: '/api/source/school/article/category/save',
    method: 'post',
    data: {
      category_name: form.category_name,
      order: form.order
    }
  })
}

export function editCategory(form) {
  return request({
    url: '/api/source/school/article/category/update',
    method: 'post',
    data: {
      id: form.id,
      category_name: form.category_name,
      order: form.order
    }
  })
}

export function deleteCategory(id) {
  return request({
    url: '/api/source/school/article/category/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
