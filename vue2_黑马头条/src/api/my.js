// 个人中心
import request from '@/utils/request.js'

// 获取用户基本信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: 'v1_0/user'
  })
}
