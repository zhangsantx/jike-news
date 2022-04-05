import React, { useEffect, useState } from 'react'
import { Button, Modal, notification, Table } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { auditNews, getAuditingNews } from '../../../api/audit'
import { getItem } from '../../../utils/storage'
import moment from 'moment'

const { confirm } = Modal

// 审核列表
export default function Audit() {
  const [auditingNews, setAuditingNews] = useState([]) // 待审核新闻列表
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading

  const currentUser = getItem('jikenews') // 当前登录用户
  // 获取当前登录用户名、用户类型(roleId 1-超级管理员 2-区域管理员 3-区域编辑)和所属区域、用户id
  const { username, roleId, region } = currentUser

  useEffect(() => {
    initAuditingNews()
  }, []) // eslint-disable-line

  // 获取待审核新闻列表
  const initAuditingNews = async () => {
    const { data } = await getAuditingNews()
    // 判断当前登录用户类型提供不同的待审核列表
    setAuditingNews(
      // 超级管理员，提供所有
      roleId === 1
        ? data
        : [
            // 区域管理员，提供用户自已和所属区域的所有区域编辑（roleId === 3）
            ...data.filter((item) => item.author === username),
            ...data.filter((item) => item.region === region && item.roleId === 3)
          ]
    )
  }

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
              handleAudit(news, 2, 1)
            }}
          >
            通过
          </Button>
          <Button
            type="danger"
            ghost
            shape="round"
            style={{ marginRight: 10 }}
            onClick={() => {
              handleAudit(news, 3, 0)
            }}
          >
            驳回
          </Button>
        </>
      )
    }
  ]

  // 审核操作
  const handleAudit = async (news, auditState, publishState) => {
    confirm({
      title: `确定要${auditState === 2 ? '通过' : '驳回'}该审核申请吗`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: `${auditState === 2 ? 'primary' : 'danger'}`,
      cancelText: '取消',
      onOk: async () => {
        // 开启loading
        setIsTableLoading(true)
        try {
          // 修改本地
          setAuditingNews(auditingNews.filter((data) => data.id !== news.id))
          // 修改服务器
          const data = await auditNews(news.id, auditState, publishState)

          if (data.status === 200) {
            notification.open({
              type: 'success',
              message: `已${auditState === 2 ? '通过' : '驳回'}审核申请`,
              description: '可前往 审核管理/审核列表 中查看详情'
            })
          } else {
            notification.open({
              type: 'error',
              message: '网络错误',
              description: '网络好像出了点问题，请稍后重试'
            })
          }
          // 关闭loading
          setIsTableLoading(false)
        } catch (error) {
          // 关闭loading
          setIsTableLoading(false)
        }
        // 关闭loading
        setIsTableLoading(false)
      },
      onCancel() {}
    })
  }

  return (
    <div>
      {/* 数据展示表格 */}
      <Table
        dataSource={auditingNews}
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
