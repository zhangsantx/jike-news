import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BackTop, Button, Descriptions, message, PageHeader } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import { getNewsInfo, updateNewsViewOrStar } from '../../api/news'
import moment from 'moment'
import './Detail.scss'
import MainHeader from './MainHeader'

// 新闻详情
export default function Detail() {
  const { id } = useParams() // 获取传递的路由参数
  const [newsInfo, setNewsInfo] = useState(null) // 新闻信息
  const [isStared, setIsStared] = useState(false) // 点赞状态
  const [isShowStarLoading, setIsShowStarLoading] = useState(false) // 点赞loading

  useEffect(() => {
    // 获取新闻详情
    const initNewsInfo = async () => {
      const { data } = await getNewsInfo(id)

      // 设置页面标题
      document.title = `${data.title} - 即刻新闻`

      // 修改访问量
      setNewsInfo({
        ...data,
        // 访问量+1
        view: data.view + 1
      })
      // 更新后端访问量
      updateNewsViewOrStar(id, {
        view: data.view + 1
      })
    }
    initNewsInfo()
  }, [id])

  // 点赞或取消点赞
  const starNews = async () => {
    // 开启loading
    setIsShowStarLoading(true)
    try {
      // 修改本地
      setNewsInfo({
        ...newsInfo,
        star: isStared ? newsInfo.star - 1 : newsInfo.star + 1
      })
      // 更新后端点赞量
      const data = await updateNewsViewOrStar(id, {
        star: isStared ? newsInfo.star - 1 : newsInfo.star + 1
      })
      if (data.status === 200) {
        message.success(`${isStared ? '取消点赞' : '点赞'}成功`)
      } else {
        message.error(`${isStared ? '取消点赞' : '点赞'}失败，请稍后重试`)
      }
      // 修改点赞状态
      setIsStared(!isStared)
      // 关闭loading
      setIsShowStarLoading(false)
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsShowStarLoading(false)
    }
    // 关闭loading
    setIsShowStarLoading(false)
  }

  return (
    <div className="detail-warp">
      <MainHeader />
      {newsInfo && (
        <PageHeader
          className="news-info-warp"
          ghost={false}
          onBack={() => window.history.back()}
          title={newsInfo.title}
          extra={
            <Button
              type={isStared ? 'danger' : 'priamry'}
              shape="round"
              loading={isShowStarLoading}
              onClick={() => {
                starNews()
              }}
            >
              {isStared ? <HeartOutlined style={{ color: '#fff' }} /> : <HeartOutlined />}
              {isStared ? '取消点赞' : '点赞'}
            </Button>
          }
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="作者">{newsInfo.author}</Descriptions.Item>
            <Descriptions.Item label="所属分类">{newsInfo.category.title}</Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '暂未发布'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="访问量">
              <span className="nums-item">{newsInfo.view}</span>
            </Descriptions.Item>
            <Descriptions.Item label="点赞数">
              <span className="nums-item">{newsInfo.star}</span>
            </Descriptions.Item>
            <Descriptions.Item label="评论数">
              <span className="nums-item">-</span>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      )}

      {/* 文章内容 */}
      {newsInfo && (
        <div className="news-contenr-warp">
          <div className="content-title">文章详情</div>
          {<div className="news-content" dangerouslySetInnerHTML={{ __html: newsInfo && newsInfo.content }}></div>}
        </div>
      )}
      {/* 返回顶部 */}
      <BackTop />
    </div>
  )
}
