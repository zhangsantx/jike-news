// 新闻相关请求模块
import request from '../utils/request'

// 获取新闻分类列列表
export const getCategoriyList = () => {
  return request({
    method: 'GET',
    url: '/categories'
  })
}

// 保存至草稿箱或提交审核
export const saveNews = (data) => {
  return request({
    method: 'POST',
    url: '/news',
    data
  })
}

// 提交审核
export const submitNews = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data
  })
}

// 更新新闻
export const updateNews = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data
  })
}

// 获取指定用户草稿箱新闻
export const getUserDraft = (username) => {
  return request({
    method: 'GET',
    url: '/news',
    params: {
      author: username,
      auditState: 0,
      _expand: 'category'
    }
  })
}

// 获取所有已发布新闻
export const getAllNews = () => {
  return request({
    method: 'GET',
    url: '/news',
    params: {
      auditState: 2,
      _expand: 'category'
    }
  })
}

// 删除新闻
export const deleteNews = (id) => {
  return request({
    method: 'DELETE',
    url: `/news/${id}`
  })
}

// 获取新闻详情
export const getNewsInfo = (id) => {
  return request({
    method: 'GET',
    url: `/news/${id}?_expand=category&_expand=role`
  })
}

// 发布新闻
export const publishNews = (id) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data: {
      publishState: 2,
      publishTime: Date.now()
    }
  })
}

// 下线新闻
export const sunsetNews = (id) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data: {
      publishState: 3
    }
  })
}

// 获取待发布 publishState: 1、已发布 publishState: 2 ，已下线 publishState: 3新闻
export const getNews = (author, publishState) => {
  return request({
    method: 'GET',
    url: '/news/',
    params: {
      author,
      publishState,
      _expand: 'category'
    }
  })
}

// 获取浏览榜新闻（5条，浏览量从高到低）
// http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=10
export const getTopSearchByView = () => {
  return request({
    method: 'GET',
    url: '/news',
    params: {
      publishState: 2,
      _expand: 'category',
      _sort: 'view',
      _order: 'desc',
      _limit: 5
    }
  })
}

// 获取点赞榜新闻（5条，点赞量从高到低）
// http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=10
export const getTopSearchByStar = () => {
  return request({
    method: 'GET',
    url: '/news',
    params: {
      publishState: 2,
      _expand: 'category',
      _sort: 'star',
      _order: 'desc',
      _limit: 5
    }
  })
}

// 修改新闻浏览量和点赞量
export const updateNewsViewOrStar = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data
  })
}
