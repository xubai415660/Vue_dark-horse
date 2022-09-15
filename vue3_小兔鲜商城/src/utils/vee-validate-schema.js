// 统一管理表单的验证规则
import { userCheckAccount } from '@/api/user.js'

// 定义表单-用户名验证规则
const checkAccount = value => {
  // value是将来使用该规则的表单元素的值
  // 1. 必填
  // 2. 6-20个字符，需要以字母开头
  // 如何反馈校验成功还是失败，返回true才是成功，其他情况失败，返回失败原因。
  if (!value) return '请输入用户名'
  if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
  return true
}
// 判断用户名称是否已经存在
const accountApi = async value => {
  if (!value) return '请输入用户名'
  if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
  // 服务端校验
  const { result } = await userCheckAccount(value)
  // 如果后端返回的数据中的valid值为true，证明用户名已经存在
  if (result.valid) return '用户名已存在'
  return true
}
// 密码验证规则
const checkPwd = value => {
  if (!value) return '请输入密码'
  if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
  return true
}
// 验证手机号
const checkMobile = value => {
  if (!value) return '请输入手机号'
  if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
  return true
}
// 验证手机验证码
const checkCode = value => {
  if (!value) return '请输入验证码'
  if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
  return true
}
// 验证是否同意
const isAgree = value => {
  if (!value) return '请勾选同意用户协议'
  return true
}

// 重复密码的验证规则
const rePassword = (value, { form }) => {
  if (!value) return '请输入密码'
  if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
  // 校验密码是否一致  form表单数据对象
  if (value !== form.password) return '两次输入的密码不一致'
  return true
}

export default {
  account: checkAccount,
  accountApi: accountApi,
  password: checkPwd,
  mobile: checkMobile,
  code: checkCode,
  isAgree: isAgree,
  rePassword: rePassword
}
