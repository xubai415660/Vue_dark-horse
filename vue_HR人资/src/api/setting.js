import request from '@/utils/request'

//  获取角色列表
export function reqGetRoleList (options) {
  return request({
    method: 'get',
    url: '/sys/role',
    params: options
  })
}

// 删除角色
export function reqDeleteRole (id) {
  return request({
    // Restful风格的url地址
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 添加角色提交表单
export function reqAddRole (data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 修改角色
export function reqUpdateRole (data) {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 获取角色详情id
export function reqGetRoleDetail (id) {
  return request({
    method: 'get',
    url: `/sys/role/${id}`
  })
}
// 公司信息
export function reqGetCompanyInfo (companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 给角色分配权限
export function reqAssignPerm (data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
