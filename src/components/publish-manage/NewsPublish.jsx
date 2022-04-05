import React from 'react'
import { Table } from 'antd'
import moment from 'moment'

export default function NewsPublish(props) {
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
      render: (item) => <>{props.button(item.id)}</>
    }
  ]

  return (
    <div>
      {/* 数据展示表格 */}
      <Table
        dataSource={props.newsList}
        columns={columns}
        rowKey={(Item) => Item.id}
        bordered={false}
        pagination={{
          pageSize: 10
        }}
      />
    </div>
  )
}
