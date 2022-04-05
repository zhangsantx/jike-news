// 区域相关请求
import request from '../utils/request'

// 获取角色列表
export const getRegionList = () => {
  return request({
    method: 'GET',
    url: '/regions'
  })
}
