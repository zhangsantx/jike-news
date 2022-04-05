import React from 'react'
import { useParams } from 'react-router-dom'
import NewsEdit from '../../../components/news-manage/NewsEdit'

// 修改新闻
export default function NewsUpdate() {
  const { id } = useParams() // 获取传递的路由参数
  return (
    // 编辑新闻 NewsId 新闻id updateNews 是否为更新新闻
    <NewsEdit NewsId={id} updateNews />
  )
}
