import request from '@/utils/request'

export function getAllMenu(params) {
    return request({
      url: '/menu/getAllMenu',
      method: 'get',
      
    }) 
  }