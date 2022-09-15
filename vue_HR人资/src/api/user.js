import request from '@/utils/request'

// 登录功能
export function login (data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data: data
  })
}

// 获取用户信息
export function getInfo (token) {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

// 获取用户详细信息
export function getDetailInfo (id) {
  // 参数ID表示当前登录系统的用户id
  return request({
    method: 'get',
    url: '/sys/user/' + id
  })
}

// 退出功能
export function logout () {
  return request({})
}
