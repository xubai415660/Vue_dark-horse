// 主页模块
import request from '@/utils/request.js'

// 获取顶部导航栏列表数据
export const findHeadCategory = () => {
  return request({
    method: 'get',
    url: '/home/category/head'
  })
}

// 获取品牌数据
export const findBrand = (limit) => {
  return request({
    method: 'get',
    url: '/home/brand',
    data: { limit }
  })
}

// 获取首页轮播图列表数据
export const findBanner = () => {
  return request({
    method: 'get',
    url: '/home/banner'
  })
}

// 获取新鲜好物接口数据
export const findNew = () => {
  return request({
    method: 'get',
    url: 'home/new'
  })
}

// 获取人气推荐接口数据
export const findHot = () => {
  return request({
    method: 'get',
    url: 'home/hot'
  })
}

// 获取商品信息数据
export const findGoods = () => {
  return request({
    method: 'get',
    url: 'home/goods'
  })
}

// 获取最新专题数据
export const findSpecial = () => {
  return request({
    method: 'get',
    url: 'home/special'
  })
}
