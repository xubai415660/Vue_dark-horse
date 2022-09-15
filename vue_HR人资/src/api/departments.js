// 组织架构模块
import request from '@/utils/request.js'

// 获取组件架构的所有列表数据
export function reqGetDepartments () {
  return request({
    method: 'get',
    url: '/company/department'
  })
}

// 根据id删除部门
export function reqDelDepartments (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 添加部门
export function reqAddDepartments (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 根据id获取部门的详细信息
export function reqGetDepartDetail (id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门提交表单
export function reqUpdateDepartments (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
