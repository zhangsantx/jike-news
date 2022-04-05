import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { getRouteList } from '../api/route'
import { getItem } from '../utils/storage'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux' // 引入react-redux的connent，用于连接UI组件和redux

import Audit from '../views/sandbox/audit-manage/Audit'
import AuditList from '../views/sandbox/audit-manage/AuditList'
import Home from '../views/sandbox/home/Home'
import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
import Published from '../views/sandbox/publish-manage/Published'
import Sunset from '../views/sandbox/publish-manage/Sunset'
import UnPublished from '../views/sandbox/publish-manage/UnPublished'
import RightList from '../views/sandbox/right-manage/RightList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import UserList from '../views/sandbox/user-manage/UserList'
import Nopermission from '../components/Nopermission'
import NewsPerview from '../views/sandbox/news-manage/NewsPerview'
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate'

// 动态生成路由(包括权限判断)
function NewsRouter(props) {
  const [serverRoutes, setServerRoutes] = useState([]) // 后端路由列表
  const currentUser = getItem('jikenews') // 获取当前登录用户
  // 获取当前用户权限
  const {
    role: { rights }
  } = currentUser

  // 本地路由映射表
  const localRoutes = {
    '/home': <Home />, // 首页
    '/user-manage/list': <UserList />, // 用户列表
    '/right-manage/role/list': <RoleList />, // 角色列表
    '/right-manage/right/list': <RightList />, // 权限列表
    '/news-manage/add': <NewsAdd />, // 撰写新闻
    '/news-manage/draft': <NewsDraft />, // 草稿箱
    '/news-manage/category': <NewsCategory />, // 新闻分类
    '/news-manage/preview/:id': <NewsPerview />, // 新闻预览
    '/news-manage/update/:id': <NewsUpdate />, // 更新新闻
    '/audit-manage/audit': <Audit />, // 新闻审核
    '/audit-manage/list': <AuditList />, // 审核列表
    '/publish-manage/unpublished': <UnPublished />, // 待发布
    '/publish-manage/published': <Published />, // 已发布
    '/publish-manage/sunset': <Sunset /> // 已下线
  }

  useEffect(() => {
    // 获取后端路由列表
    const initServerRoutes = async () => {
      const data = await getRouteList()
      setServerRoutes([...serverRoutes, ...data])
    }
    initServerRoutes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 判断路由状态是否可用
  const checkRoute = (item) => {
    return localRoutes[item.key] && (item.pagepermisson || item.routepermisson)
  }

  // 判断当前用户是否拥有权限
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
    // loading
    <Spin spinning={props.isLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
      {/* 路由列表 */}
      <Routes>
        {serverRoutes.map((item) => {
          // checkRoute() 路由状态 checkUserPermission() 用户是否拥有权限
          if (checkRoute(item) && checkUserPermission(item)) {
            // 有权限
            return <Route key={item.key} path={item.key} element={localRoutes[item.key]}></Route>
          } else {
            // 无权限
            return null
          }
        })}
        {serverRoutes.length > 0 && <Route path="*" element={<Nopermission />} />}
      </Routes>
    </Spin>
  )
}

// 定义容器组件
const mapStateToProps = ({ Loading: { isLoading } }) => {
  return {
    // 获取redux state数据
    isLoading
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    // 获取redux action方法
    return {
      type: 'change_ollapsed'
      // payload:
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsRouter)
