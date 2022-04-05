// 侧边菜单栏相关请求模块
import request from '../utils/request'

// 获取侧边菜单列表
export const getMenuList = () => {
  return request({
    method: 'GET',
    url: '/rights?_embed=children'
  })
}
