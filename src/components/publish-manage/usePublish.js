// 自定义hook

import { useEffect, useState } from 'react'
import { message, Modal, notification } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { deleteNews, getNews, publishNews, sunsetNews } from '../../api/news'
import { getItem } from '../../utils/storage'

const { confirm } = Modal

function usePubllish(type) {
  const [news, setNews] = useState([])
  const currentUser = getItem('jikenews') // 获取当前登录用户
  const { username } = currentUser // 获取当前登录用户名

  useEffect(() => {
    // 获取已发布新闻
    const initnews = async () => {
      const { data } = await getNews(username, type)
      setNews(data)
    }
    initnews()
  }, [username, type])

  // 发布新闻
  const handlePublish = (id) => {
    confirm({
      title: '确定要发布此文章吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 修改本地
          setNews(news.filter((item) => item.id !== id))
          // 修改服务器
          const data = await publishNews(id)
          if (data.status === 200) {
            notification.open({
              type: 'success',
              message: '发布成功',
              description: '可前往 发布管理/已发布 中查看详情'
            })
          } else {
            notification.open({
              type: 'error',
              message: '发布失败',
              description: '网络好像出了点问题，请稍后重试'
            })
          }
        } catch (error) {
          notification.open({
            type: 'error',
            message: '网络错误',
            description: '网络好像出了点问题，请稍后重试'
          })
        }
      },
      onCancel() {}
    })
  }

  // 下线新闻
  const handleSunset = (id) => {
    confirm({
      type: 'success',
      title: '确定要下线此文章吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 修改本地
          setNews(news.filter((item) => item.id !== id)) // 修改服务器
          const data = await sunsetNews(id)
          if (data.status === 200) {
            notification.open({
              type: 'success',
              message: '下线成功',
              description: '可前往 发布管理/已下线 中查看详情'
            })
          } else {
            notification.open({
              type: 'error',
              message: '下线失败',
              description: '网络好像出了点问题，请稍后重试'
            })
          }
        } catch (error) {
          notification.open({
            type: 'error',
            message: '网络错误',
            description: '网络好像出了点问题，请稍后重试'
          })
        }
      },
      onCancel() {}
    })
  }

  // 删除新闻
  const handleDelete = (id) => {
    confirm({
      title: '确定要删除此文章吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 修改本地
          setNews(news.filter((item) => item.id !== id))
          // 修改服务器
          const data = await deleteNews(id)
          if (data.status === 200) {
            message.success('已删除')
          } else {
            message.error('删除失败，请稍后重试')
          }
        } catch (error) {
          message.error('网络错误，请稍后重试')
        }
      },
      onCancel() {}
    })
  }

  return {
    news,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

export default usePubllish
