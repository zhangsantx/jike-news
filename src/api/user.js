// 用户相关请求模块
import request from '../utils/request'

// 获取用户列表
export const getUserList = () => {
  return request({
    method: 'GET',
    url: '/users?_expand=role'
  })
}

// 添加用户
export const addUser = (data) => {
  return request({
    method: 'POST',
    url: '/users?_expand=role',
    data
  })
}

// 添加用户
export const deleteUser = (id) => {
  return request({
    method: 'DELETE',
    url: `/users/${id}`
  })
}

// 修改用户
export const updateUser = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/users/${id}`,
    data
  })
}

// 用户登录
export const userLogin = (username, password) => {
  return request({
    method: 'GET',
    url: '/users',
    params: {
      username,
      password,
      roleState: true, // 判断用户是否开启
      _expand: 'role' // 获取对应权限
    }
  })
}
