import React, { useEffect, useState } from 'react'
import { List, BackTop } from 'antd'
import { getAllNews } from '../../api/news'
import _ from 'lodash'
import './News.scss'
import MainHeader from './MainHeader'

// 用户首页
export default function News() {
  const [newsList, setNewsList] = useState([])

  // 设置页面标题
  useEffect(() => {
    document.title = '即刻新闻-全球大事,尽在掌握'
  }, [])

  useEffect(() => {
    initAllNews()
  }, [])

  const initAllNews = async () => {
    const { data } = await getAllNews()

    // 将数组分组为二维数组
    const list = Object.entries(_.groupBy(data, (item) => item.category.title))
    setNewsList(list)
  }

  return (
    <div className="news-warp">
      {/* 顶部导航栏 */}
      <MainHeader />

      {/* 新闻区域 */}
      <div className="news-card-warp">
        {newsList.map((item) => {
          return (
            <div className="news-item" key={item[0]}>
              <div className="category-title">{item[0]}</div>
              <List
                className="news-list"
                itemLayout="horizontal"
                dataSource={item[1]}
                pagination={{
                  pageSize: 10,
                  hideOnSinglePage: true,
                  size: 'small'
                }}
                renderItem={(data) => (
                  <List.Item>
                    <a href={`#/detail/${data.id}`}>{data.title}</a>
                  </List.Item>
                )}
              />
            </div>
          )
        })}
      </div>
      {/* 返回顶部 */}
      <BackTop />
    </div>
  )
}
