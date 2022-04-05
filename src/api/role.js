// 角色相关请求模块
import request from '../utils/request'

// 获取角色列表
export const getRoleList = () => {
  return request({
    method: 'GET',
    url: '/roles'
  })
}

// 删除角色
export const deleteRole = (id) => {
  return request({
    method: 'DELETE',
    url: `/roles/${id}`
  })
}

// 修改角色权限
export const updateRoleLimits = (id, rights) => {
  return request({
    method: 'PATCH',
    url: `/roles/${id}`,
    data: {
      rights
    }
  })
}
