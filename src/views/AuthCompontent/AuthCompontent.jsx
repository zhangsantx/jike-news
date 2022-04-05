import React from 'react'
import { Navigate } from 'react-router-dom'
import { getItem } from '../../utils/storage'

// 配置路由拦截
export default function AuthCompontent({ children }) {
  const token = getItem('jikenews')

  // 不存在token则跳转login
  return token ? children : <Navigate to="/login" />
}
