import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import AuthCompontent from '../views/AuthCompontent/AuthCompontent'
import Login from '../views/login/Login'
import News from '../views/news/News'
import Detail from '../views/news/Detail'
import SandBox from '../views/sandbox/SandBox'

export default function IndexRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/news" element={<News />} />
      <Route path="/detail/:id" element={<Detail />} />
      {/* <AuthCompontent> 配置路由拦截 */}
      <Route
        path="*"
        element={
          <AuthCompontent>
            <SandBox />
          </AuthCompontent>
        }
      />
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  )
}
