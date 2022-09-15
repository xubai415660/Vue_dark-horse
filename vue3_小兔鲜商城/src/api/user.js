// 用户模块
import request from '@/utils/request.js'

// 实现普通的账号登录接口
export const userAccountLogin = ({ account, password }) => {
  return request({
    method: 'post',
    url: '/login',
    data: { account, password }
  })
}

// 实现手机号登录
export const userMobileLogin = ({ mobile, code }) => {
  return request({
    method: 'post',
    url: '/login/code',
    data: { mobile, code }
  })
}

// 调用接口实现给手机发送验证码
export const userMobileLoginMsg = mobile => {
  return request({
    method: 'get',
    url: '/login/code',
    data: { mobile }
  })
}

// 第三方QQ登录
export const userQQLogin = (unionId, source = 6) => {
  return request({
    method: 'post',
    url: '/login/social',
    data: { unionId, source }
  })
}

// 绑定手机号
export const userQQBindMobile = (unionId, mobile, code) => {
  return request({
    method: 'post',
    url: '/login/social/bind',
    data: { unionId, mobile, code }
  })
}

// 判断注册的用户名是否已经存在
export const userCheckAccount = account => {
  return request({
    method: 'get',
    url: '/register/check',
    data: { account }
  })
}

// 注册新的账号发送手机验证码
export const userQQPatchCode = mobile => {
  return request({
    method: 'get',
    url: '/register/code',
    data: { mobile }
  })
}

// 注册新账号提交表单接口
export const userQQPatchLogin = (unionId, form) => {
  return request({
    method: 'post',
    url: '/login/social/' + unionId + '/complement',
    data: form
  })
}

// 绑定手机号
export const userQQBindLogin = (unionId, mobile, code) => {
  return request({
    method: 'post',
    url: '/login/social/bind',
    data: { unionId, mobile, code }
  })
}
// 获取QQ绑定的时候短信验证码
export const userQQBindCode = mobile => {
  return request({
    method: 'get',
    url: '/login/social/code',
    data: { mobile }
  })
}
