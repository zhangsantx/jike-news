// 路由相关请求模块
import request from '../utils/request'

// 获取路由列表将/rights和/children的数据进行合并返回
export const getRouteList = async () => {
  const data = await Promise.all([
    request({
      method: 'GET',
      url: '/rights'
    }),
    request({
      method: 'GET',
      url: '/children'
    })
  ])
  return [...data[0].data, ...data[1].data]
}
