import request from '@/utils/request'

export function login(data) {
  return request({
    //url: '/vue-admin-template/user/login',
    url: '/auth/login',
    method: 'post',
    data
  })
}


export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
// 获取路由
export function getRouter() {
  return request({
    url: '/auth/getRouter',
    method: 'get'
  })
}