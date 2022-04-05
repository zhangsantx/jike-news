import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePubllish from '../../../components/publish-manage/usePublish'

// 待发布
export default function UnPublished() {
  // 使用自定义hook
  // 获取待发布新闻 type = 1
  const { news, handlePublish } = usePubllish(1)

  return (
    <div>
      <NewsPublish
        newsList={news}
        button={(id) => (
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              // 发布新闻
              handlePublish(id)
            }}
          >
            发布
          </Button>
        )}
      />
    </div>
  )
}
