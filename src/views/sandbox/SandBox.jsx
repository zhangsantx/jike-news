import React, { useEffect } from 'react'
import { Layout } from 'antd'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
// import { Outlet } from 'react-router-dom'
import NewsRouter from '../../components/NewsRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './SandBox.css'

const { Content } = Layout

export default function SandBox() {
  // 开启顶部进度条（开始渲染时开启）
  NProgress.start()
  useEffect(() => {
    // 关闭顶部进度条（渲染完毕之后关闭）
    NProgress.done()
  })

  return (
    <Layout>
      {/* 顶部导航栏 */}
      <TopHeader />
      <Layout className="site-layout">
        {/* 侧边栏 */}
        <SideMenu />
        {/* 内容区域 */}
        <Content className="site-layout-background">
          {/* 指定路由组件呈现的位置 */}
          {/* <Outlet /> */}
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )
}
