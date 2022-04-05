import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Descriptions, PageHeader, Tag } from 'antd'
import { getNewsInfo } from '../../../api/news'
import moment from 'moment'
import './NewsPerview.scss'

// 新闻预览
export default function NewsPerview() {
  const { id } = useParams() // 获取传递的路由参数
  const [newsInfo, setNewsInfo] = useState(null)

  useEffect(() => {
    // 获取新闻详情
    const initNewsInfo = async () => {
      const { data } = await getNewsInfo(id)

      // 设置页面标题
      document.title = `${data.title} - 即刻新闻`

      setNewsInfo(data)
    }
    initNewsInfo()
  }, [id])

  const auditList = ['未审核', '审核中', '已通过', '未通过'] // 审核状态
  const publishList = ['未发布', '待发布', '已发布', '已下线'] // 发布状态
  const colorList = ['warning', 'processing', 'success', 'error'] // tag颜色

  return (
    <div className="preview-warp">
      {newsInfo && (
        <PageHeader className="news-info-warp" ghost={false} onBack={() => window.history.back()} title={newsInfo.title}>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="作者">{newsInfo.author}</Descriptions.Item>
            <Descriptions.Item label="所属分类">{newsInfo.category.title}</Descriptions.Item>
            <Descriptions.Item label="发布区域">{newsInfo.region}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '暂未发布'}
            </Descriptions.Item>

            <Descriptions.Item label="审核状态">
              <Tag color={colorList[newsInfo.auditState]}>{auditList[newsInfo.auditState]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发布状态">
              <Tag color={colorList[newsInfo.publishState]}>{publishList[newsInfo.publishState]}</Tag>
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
          <div className="content-title">文章预览</div>
          {<div className="news-content" dangerouslySetInnerHTML={{ __html: newsInfo && newsInfo.content }}></div>}
        </div>
      )}
    </div>
  )
}
