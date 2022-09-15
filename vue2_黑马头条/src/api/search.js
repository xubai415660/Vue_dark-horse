// 搜索模块
import request from '@/utils/request.js'

export const searchList = (keyword) => {
  return request({
    method: 'get',
    url: 'v1_0/suggestion',
    params: {
      q: keyword
    }
  })
}

// 搜索文章
export const searchArticles = (options) => {
  return request({
    method: 'get',
    url: 'v1_0/search',
    // axios传递get请求参数本来就是使用params
    params: {
      // 当前页码
      page: options.pagenum,
      // 每页的条数
      per_page: options.pagesize,
      // 查询的关键字
      q: options.kw
    }
  })
}
