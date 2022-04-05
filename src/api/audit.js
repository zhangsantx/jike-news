// 审核相关请求模块
import request from '../utils/request'

// 获取用户审核列表
export const getNewsInAudit = (username) => {
  return request({
    method: 'GET',
    url: '/news',
    params: {
      author: username,
      auditState_ne: 0,
      publishState_lte: 1,
      _expand: 'category'
    }
  })
}

// 撤销审核申请
export const revertAudit = (id) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data: {
      auditState: 0
    }
  })
}

// 获取待审核新闻
export const getAuditingNews = () => {
  return request({
    method: 'GET',
    url: '/news',
    params: {
      auditState: 1,
      _expand: 'category'
    }
  })
}

// 通过审核 auditState=2, publishState=1 /驳回审核 auditState=3, publishState=0
// 审核状态 auditState=2, 发布状态 publishState=1
export const auditNews = (id, auditState, publishState) => {
  return request({
    method: 'PATCH',
    url: `/news/${id}`,
    data: {
      auditState,
      publishState
    }
  })
}
