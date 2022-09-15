import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
// 基准路径
// const baseURL = 'http://ihrm-java.itheima.net/api/'

// 创建一个axios实例对象
const instance = axios.create({
  // VUE_APP_BASE_API的值来源于配置文件
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: baseURL,
  // 超时,如果超过5秒，后端没有返回数据，那么就报错
  timeout: 5000
})

// -------------------------请求拦截器---------------------------------
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 如果token存在 注入token
      config.headers = {
        Authorization: `Bearer ${store.getters.token}`
      }
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

// ------------------响应拦截器----拦截器处理token失效---------------------------------
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么：去掉axios默认包装的data属性
    return response.data
  },
  function (error) {
    // 判断token是否失效
    if (error.response.status === 401 && error.response.data.code === 10002) {
      // token已经失效，删除用户信息，跳转到登录页面
      store.commit('user/updateUserInfo', null)
      store.commit('user/removeToken')
      return router.push('/login')
    } else {
      // 不是401，也不是200，那么说明是其他错误，直接进行提示
      console.log('token其他错误')
      Message.error(error.response.message)
    }
    return Promise.reject(error)
  })

export default (options) => {
  return instance({
    // 请求方式
    // 这里的 /api 由于开发环境所有接口都要加, 通过baseUrl加
    method: options.method || 'GET',
    // 请求地址
    url: options.url,
    // post/put 请求体传递的参数
    data: options.data,
    // get 请求传参
    params: options.params,
    // 请求头
    headers: options.headers
  })
}
