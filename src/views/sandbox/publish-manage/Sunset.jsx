import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePubllish from '../../../components/publish-manage/usePublish'

// 已下线
export default function Sunset() {
  // 使用自定义hook
  // 已下线新闻 type = 3
  const { news, handleDelete } = usePubllish(3)

  return (
    <div>
      <NewsPublish
        newsList={news}
        button={(id) => (
          <Button
            danger
            ghost
            shape="round"
            onClick={() => {
              // 删除新闻
              handleDelete(id)
            }}
          >
            删除
          </Button>
        )}
      />
    </div>
  )
}
