import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePubllish from '../../../components/publish-manage/usePublish'

// 已发布
export default function Published() {
  // 使用自定义hook
  // 获取已发布新闻 type = 2
  const { news, handleSunset } = usePubllish(2)

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
              // 下线新闻
              handleSunset(id)
            }}
          >
            下线
          </Button>
        )}
      />
    </div>
  )
}
