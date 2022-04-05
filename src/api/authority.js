// 权限相关请求模块
import request from '../utils/request'

// 获取权限列表
export const getLimits = () => {
  return request({
    method: 'GET',
    url: '/rights?_embed=children'
  })
}

// 删除一级权限
export const deleteFirstLimit = (id) => {
  return request({
    method: 'DELETE',
    url: `/rights/${id}`
  })
}

// 删除二级权限
export const deleteSecondLimit = (id) => {
  return request({
    method: 'DELETE',
    url: `/children/${id}`
  })
}

// 开启关闭一级权限
export const editFirstLimit = (id, pagepermisson) => {
  return request({
    method: 'PATCH',
    url: `/rights/${id}`,
    data: { pagepermisson }
  })
}

// 开启关闭二级权限
export const editSecondLimit = (id, pagepermisson) => {
  return request({
    method: 'PATCH',
    url: `/children/${id}`,
    data: { pagepermisson }
  })
}
