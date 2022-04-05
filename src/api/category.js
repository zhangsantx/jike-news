// 新闻分类相关请求模块
import request from '../utils/request'

// 删除新闻分类
export const deleteCategory = (id) => {
  return request({
    method: 'DELETE',
    url: `/categories/${id}`
  })
}

// 修改分类名称
export const updateCategory = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/categories/${id}`,
    data
  })
}
