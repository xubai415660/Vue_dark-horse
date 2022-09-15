// Login业务模块 ，专门负责调用接口
import request from '@/utils/request.js'

// 实现登录功能
export const login = (mobile, code) => {
  // 这里return的是谁？Promise实例对象
  return request({
    method: 'POST',
    url: 'v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
