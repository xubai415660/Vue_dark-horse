import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token_128'

// 获取指定的cookie
export function getToken () {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
// 删除token
export function removeToken () {
  return Cookies.remove(TokenKey)
}
