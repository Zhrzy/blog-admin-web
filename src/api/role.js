import request from '@/utils/request'

// 获取管理员列表
export function getAdminList(params) {
    return request({
      url: '/admin/getAdminList',
      method: 'get',
      params
    }) 
  }

// 新增
export function addAdmin(params) {
  return request({
    url: '/admin/addAdmin',
    method: 'post',
    data: params
  }) 
}

// 修改
export function editorAdmin(params) {
  return request({
    url: '/admin/editorAdmin',
    method: 'post',
    data: params
  }) 
}

// 删除
export function deleteAdmin(params) {
  return request({
    url: '/admin/deleteAdmin',
    method: 'post',
    data: params
  }) 
}
//状态切换
export function changeStatus(params) {
  return request({
    url: '/admin/changeStatus',
    method: 'post',
    data: params
  }) 
}


// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/role/getRoleList',
    method: 'get',
    params
  }) 
}
