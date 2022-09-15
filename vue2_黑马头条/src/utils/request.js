// 封装接口调用模块
import axios from 'axios'
import router from '@/router/index.js'
const JSONbig = require('json-bigint')

// 设置调用接口基准路径
// axios.defaults.baseURL = 'http://api-toutiao-web.itheima.net/app/'

// -------------------接口调用基准路径----------------------------
const baseURL = 'http://api-toutiao-web.itheima.net/app/'

// instance其实就是axios(但是基准路径被设置了)
const instance = axios.create({
  // 在接口获取数据之前对后端的原始数据进行处理
  // 这里处理发生的响应式拦截器之前（它最先接触到后端返回的原始数据）
  transformResponse: [(data) => {
    // 这里对数据处理好之后，再交给响应式拦截器即可
    try {
      return JSONbig.parse(data)
    } catch {
      // 如果数据转换错误，就不做转换，返回原始数据
      return data
    }
  }],
  baseURL: baseURL
})

// ----------------添加一个请求拦截器-------------------------
instance.interceptors.request.use(
  function (config) {
    // 请求发送之前可以做一些事情
    // console.log('before request')
    const user = JSON.parse(sessionStorage.getItem('mytoken') || null)
    if (user && user.token && user.refresh_token) {
      // 发送请求之前统一添加请求头，这样的话，单独调用接口时，就不需要再添加了
      config.headers.Authorization = 'Bearer ' + user.token
    }
    return config
  },
  function (error) {
    // 请求如果出错了可以做一些事情
    return Promise.reject(error)
  }
)

// -------------------添加一个向应拦截器------------------------------
instance.interceptors.response.use(function (response) {
  // 服务器返回的200范围内的状态码都会触发该函数
  // 针对向应的数据可以做一些处理
  console.log('before response')
  // 拦截器在返回数据之前，直接获取后端的原始数据，然后再返回
  return response.data
},
async function (error) {
  // console.dir(error)
  // 判断token是否失效
  if (error.response && error.response.status === 401) {
    try {
      // 10、token失效了，此时需要申请一个新的token(根据refresh_token申请)
      const user = JSON.parse(sessionStorage.getItem('mytoken') || null)
      const info = await axios({
        method: 'put',
        url: baseURL + 'v1_0/authorizations',
        headers: {
          Authorization: 'Bearer ' + user.refresh_token
        }
      })
      // 获取最新的token数据
      // const newToken = info.data.data.token
      // 13、用新的token更新本地缓存的token
      user.token = info.data.data.token
      sessionStorage.setItem('mytoken', JSON.stringify(user))
      // 14、重新调用刚才的接口（用新token）
      // error.config表示当前出错的接口调用的配置选项
      return instance(error.config)
    } catch (e) {
      console.log(e)
      // 换取token失败了（refresh_token失效了），跳转到登录页面
      // 这里导入的router本质上和 this.$router 是等效的
      return router.push('/login')
    }
  }
  // 服务器返回的200范围以外的状态码都会触发该函数
  // 针对向应的错误信息可以做一些处理
  return Promise.reject(error)
}
)

// ---------------封装通用的接口调用方法---------------------------
export default function request (options) {
  // console.log(options.data)
  // 这里的返回值是Promise实例对象
  return instance({
    // 设置请求方式
    method: options.method || 'GET',
    // 设置请求地址
    url: options.url,
    // POST/PUT请求参数（请求体）
    data: options.data,
    // GET请求参数（自动拼接到url地址中）
    params: options.params,
    // 设置请求头
    headers: options.headers
  })
}
