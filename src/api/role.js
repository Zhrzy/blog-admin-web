import request from '@/utils/request'

// 获取管理员列表
export function getAdminList(params) {
    return request({
      url: '/admin/getAdminList',
      method: 'get',
      params
    }) 
  }