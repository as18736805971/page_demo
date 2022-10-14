import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { article_category, article_title } = search
  return request({
    url: '/api/source/article/paginate',
    method: 'post',
    data: {
      category: article_category,
      title: article_title,
      page_num: page,
      page_size: page_size
    }
  })
}

export function detail(id) {
  return request({
    url: '/api/source/article/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function save(form) {
  return request({
    url: '/api/source/article/save',
    method: 'post',
    data: {
      title: form.article_title,
      banner: form.article_banner,
      category: form.article_category,
      content: form.article_content,
      is_recommend: form.article_is_recommend
    }
  })
}

export function update(id, form) {
  return request({
    url: '/api/source/article/update',
    method: 'post',
    data: {
      id: id,
      title: form.article_title,
      banner: form.article_banner,
      category: form.article_category,
      content: form.article_content,
      is_recommend: form.article_is_recommend
    }
  })
}

export function del(id) {
  return request({
    url: '/api/source/article/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
