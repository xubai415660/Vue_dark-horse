// 封装通用的接口调用模块----------------------
import axios from 'axios'
import store from '@/store'
import router from '@/router'

// ------------------请求的基准路径-----------------------------
export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net/'

// 创建独立的axios的实例
const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

// ------------请求拦截器:统一添加请求头--------------------
instance.interceptors.request.use((config) => {
  // 判断Vuex中是否有token，如果有就添加到请求头
  const token = store.state.user.profile.token
  // 2. 判断是否有token
  if (token) {
    // 3. 设置token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// ------------响应拦截器：处理后端返回的数据，把data属性去掉----------------
instance.interceptors.response.use((response) => {
  return response.data
}, (err) => {
  // 处理token的过期操作
  if (err.response && err.response.status === 401) {
    // token过期了，清空过期的用户信息，跳转到登录页面
    store.commit('user/updateUserInfo', {})
    router.push('/login')
  }
  return Promise.reject(err)
})

// ----------------封装一个通用的请求方法----------------------------
export default (options) => {
  return instance({
    // 如果没有传递请求方式，默认是使用get请求
    method: options.method || 'GET',
    // 请求地址
    url: options.url,
    // 对象的键可以是动态的变量
    // get请求，添加params属性，其他请求添加data属性
    [options.method.toUpperCase() === 'GET' ? 'params' : 'data']: options.data
    // data用于传递请求体数据（POST/PUT/DELETE）
    // data: options.data,
    // params用于传递get请求数据（查询字符串）
    // params: options.data
  })
}
