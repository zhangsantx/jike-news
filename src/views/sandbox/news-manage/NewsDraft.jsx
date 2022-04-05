import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, message, notification } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getUserDraft, deleteNews, submitNews } from '../../../api/news'
import { getItem } from '../../../utils/storage'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const { confirm } = Modal

// 草稿箱
export default function NewsDraft() {
  const [newsList, setNewsList] = useState([]) // 新闻数据列表
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading
  const currentUser = getItem('jikenews') // 获取当前登录用户
  const navigate = useNavigate()

  useEffect(() => {
    // 获取草稿箱内容
    const initNewsList = async () => {
      const { data } = await getUserDraft(currentUser.username)
      setNewsList(data)
    }
    initNewsList()
  }, [currentUser.username])

  // 表头
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (title, news) => {
        return <a href={`#/news-manage/preview/${news.id}`}>{news.title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '保存时间',
      dataIndex: 'createTime',
      render: (createTime) => {
        return moment(createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '操作',
      render: (news) => (
        <>
          <Button
            type="primary"
            shape="round"
            style={{ marginRight: 10 }}
            onClick={() => {
              handelSubmit(news.id)
            }}
          >
            提交审核
          </Button>
          <Button
            shape="circle"
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
            onClick={() => {
              // 跳转更新页面
              navigate(`/news-manage/update/${news.id}`)
            }}
          />
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(news)} />
        </>
      )
    }
  ]

  // 点击删除回调
  const onDelete = (news) => {
    confirm({
      title: '确定要删除此文章吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        onDeleteNews(news)
      },
      onCancel() {}
    })
  }

  // 删除新闻
  const onDeleteNews = async (news) => {
    // 开启loading
    setIsTableLoading(true)

    try {
      // 删除本地
      setNewsList(newsList.filter((data) => data.id !== news.id))
      // 删除服务器
      const data = await deleteNews(news.id)
      if (data.status === 200) {
        message.success('删除成功')
      } else {
        message.error('删除失败，请稍后重试')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsTableLoading(false)
    }
    // 关闭loading
    setIsTableLoading(false)
  }

  // 提交审核
  const handelSubmit = async (id) => {
    // 开启loading
    setIsTableLoading(true)

    try {
      // 保存本地
      setNewsList(
        newsList.filter((item) => {
          return item.id !== id
        })
      )
      // 保存服务器
      const data = await submitNews(id, { auditState: 1 })

      if (data.status === 200) {
        notification.open({
          type: 'success',
          message: '提交审核成功',
          description: '可前往 审核管理/审核列表 中查看详情'
        })
      } else {
        notification.open({
          type: 'error',
          message: '提交审核失败',
          description: '网络好像出了点问题，请稍后重试'
        })
      }
      // 关闭loading
      setIsTableLoading(false)
    } catch (error) {
      notification.open({
        type: 'error',
        message: '提交审核失败',
        description: '网络好像出了点问题，请稍后重试'
      })
      // 关闭loading
      setIsTableLoading(false)
    }
  }

  return (
    <div>
      {/* 数据展示表格 */}
      <Table
        dataSource={newsList}
        columns={columns}
        rowKey={(Item) => Item.id}
        bordered={false}
        loading={isTableLoading}
        pagination={{
          pageSize: 10
        }}
      />
    </div>
  )
}
