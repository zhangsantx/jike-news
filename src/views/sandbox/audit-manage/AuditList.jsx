import React, { useEffect, useState } from 'react'
import { Button, Modal, notification, Table, Tag } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getNewsInAudit, revertAudit } from '../../../api/audit'
import { publishNews } from '../../../api/news'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { getItem } from '../../../utils/storage'

const { confirm } = Modal

// 审核列表
export default function AuditList() {
  const [auditNews, setauditNews] = useState([]) // 审核列表
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading
  const navigate = useNavigate()

  const currentUser = getItem('jikenews') // 当前登录用户
  // 获取当前登录用户名、用户类型(roleId 1-超级管理员 2-区域管理员 3-区域编辑)和所属区域、用户id
  const { username, roleId, region } = currentUser

  useEffect(() => {
    initNesInAudit()
  }, []) // eslint-disable-line

  // 获取审核新闻列表
  const initNesInAudit = async () => {
    const { data } = await getNewsInAudit()
    // 判断当前登录用户类型提供不同的审核列表
    if (roleId === 1) {
      // 超级管理员，提供所有
      setauditNews(data)
    } else if (roleId === 2) {
      // 区域管理员，提供用户自已和所属区域的所有区域编辑（roleId === 3）
      setauditNews([...data.filter((item) => item.author === username), ...data.filter((item) => item.region === region && item.roleId === 3)])
    } else {
      // 区域编辑，提供自己所属
      setauditNews([...data.filter((item) => item.author === username)])
    }

    // // 判断当前登录用户-只提供用户自己的审核列表
    // setauditNews([...data.filter((item) => item.author === username)])
  }

  // 撤销审核
  const handleRevert = async (news) => {
    // 开启loading
    setIsTableLoading(true)
    try {
      // 删除本地
      setauditNews(auditNews.filter((data) => data.id !== news.id))
      // 删除服务器
      const data = await revertAudit(news.id)

      if (data.status === 200) {
        notification.open({
          type: 'success',
          message: '撤销成功',
          description: '文章已自动存入草稿箱，可前往查看'
        })
      } else {
        notification.open({
          type: 'error',
          message: '撤销失败',
          description: '网络好像出了点问题，请稍后重试'
        })
      }
    } catch (error) {
      // 关闭loading
      setIsTableLoading(false)
    }
    // 关闭loading
    setIsTableLoading(false)
  }

  // 发布新闻
  const handlePublish = (news) => {
    confirm({
      title: '确定要发布此文章吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'warning',
      cancelText: '取消',
      onOk() {
        onPublishNews(news)
      },
      onCancel() {}
    })
  }

  // 发布新闻
  const onPublishNews = async (news) => {
    // 开启loading
    setIsTableLoading(true)
    try {
      // 修改本地
      setauditNews(auditNews.filter((data) => data.id !== news.id))
      // 修改服务器
      const data = await publishNews(news.id)

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
      // 关闭loading
      setIsTableLoading(false)
    }
    // 关闭loading
    setIsTableLoading(false)
  }

  const auditTypeList = ['未审核', '审核中', '已通过', '未通过'] // 审核状态
  const colorList = ['warning', 'processing', 'success', 'error'] // tag颜色

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
      title: '状态',
      dataIndex: 'auditState',
      render: (auditState) => (
        <>
          <Tag color={colorList[auditState]}>{auditTypeList[auditState]}</Tag>
        </>
      )
    },
    {
      title: '操作',
      render: (news) => (
        <>
          {news.auditState === 1 && (
            <Button
              type="primary"
              ghost
              shape="round"
              style={{ marginRight: 10 }}
              onClick={() => {
                handleRevert(news)
              }}
            >
              撤销
            </Button>
          )}
          {news.auditState === 2 && (
            <Button
              type="primary"
              shape="round"
              style={{ marginRight: 10 }}
              onClick={() => {
                handlePublish(news)
              }}
            >
              发布
            </Button>
          )}
          {news.auditState === 3 && (
            <Button
              type="danger"
              ghost
              shape="round"
              style={{ marginRight: 10 }}
              onClick={() => {
                // 跳转更新页面
                navigate(`/news-manage/update/${news.id}`)
              }}
            >
              修改
            </Button>
          )}
        </>
      )
    }
  ]

  return (
    <div>
      {/* 数据展示表格 */}
      <Table
        dataSource={auditNews}
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
