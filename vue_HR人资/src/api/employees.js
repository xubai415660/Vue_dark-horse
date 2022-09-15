import request from '@/utils/request'

// 获取员工的简单列表
export function getEmployeeSimple () {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取员工列表数据
export function reqGetEmployeeList (options) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params: options
  })
}

// 删除员工
export function reqDelEmployee (id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

// 添加员工提交表单
export function reqAddEmployee (data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

// 基于Excel导入员工数据
export function reqImportEmployee (data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 重置员工的密码
export function reqSaveUserDetailById (data) {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}

// 读取用户详情的基础信息 (个人详情-下面的接口)
export function reqGetPersonalDetail (id) {
  return request({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}

// 更新用户详情的基础信息 (个人详情-下面的接口)
export function reqUpdatePersonal (data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

// 获取用户的岗位信息  (岗位信息)
export function reqGetJobDetail (id) {
  return request({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

// 保存岗位信息  (岗位信息)
export function reqUpdateJob (data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}

// 获取员工的简单列表
export function reqGetEmployeeSimple () {
  return request({
    url: '/sys/user/simple'
  })
}

// 分配角色提交表单
export function reqAssignRoles (data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
