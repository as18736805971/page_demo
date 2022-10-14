import request from '@/utils/request'

export function paginate(search, page, page_size) {
  const { article_category, article_title } = search
  return request({
    url: '/api/source/school/article/paginate',
    method: 'post',
    data: {
      category: article_category,
      title: article_title,
      page_num: page,
      page_size: page_size
    }
  })
}

export function getNewsDetail(id) {
  return request({
    url: '/api/source/school/article/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function addNews(form) {
  return request({
    url: '/api/source/school/article/save',
    method: 'post',
    data: {
      title: form.article_title,
      banner: form.article_banner,
      category: form.article_category,
      content: form.article_content
    }
  })
}

export function editNews(id, form) {
  return request({
    url: '/api/source/school/article/update',
    method: 'post',
    data: {
      id: id,
      title: form.article_title,
      banner: form.article_banner,
      category: form.article_category,
      content: form.article_content
    }
  })
}

export function deleteNews(id) {
  return request({
    url: '/api/source/school/article/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
