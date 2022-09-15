import request from '@/utils/request.js'
import axios from 'axios'
import { cityUrl, mockBaseUrl } from '@/utils/config.js'

// 获取商品的详细数据
export const findGoods = id => {
  return request({
    method: 'get',
    url: '/goods',
    data: { id }
  })
}

// 获取城市列表数据
export const getCityList = async () => {
  // 添加缓存，防止频繁加载列表数据
  if (window.cityList) {
    // 缓存中已经存在数据了
    return window.cityList
  }
  const ret = await axios.get(cityUrl)
  // 给window对象添加了一个属性cityList
  window.cityList = ret.data
  // 把数据返回
  return ret.data
}

// 获取商品相关的同类商品获取用户喜欢的商品
export const findRelGoods = (id, limit = 16) => {
  // limit表示分页参数，代表每页查询多少条数据
  return request({
    method: 'get',
    url: '/goods/relevant',
    data: { id, limit }
  })
}

// 获取热销榜数据
export const findHotGoods = ({ id, type, limit = 3 }) => {
  // type表示热销类型
  // limit表示每页的条数
  return request({
    method: 'get',
    url: '/goods/hot',
    data: { id, type, limit }
  })
}

// 获取商品的评论的统计数据
export const findCommentInfoByGoods = (id) => {
  // return request({method: 'get',url: '`/goods/${id}/evaluate`'})
  return request({
    method: 'get',
    // 当请求地址是http或者是https等标准协议时，那么axios基准路径不会再次拼接
    // 评论数据没有正式的接口，如下的地址是模拟的假数据
    url: `${mockBaseUrl}/goods/${id}/evaluate`
  })
}

// 获取评论列表数据
export const findCommentListByGoods = (id, data) => {
  return request({
    method: 'get',
    url: `${mockBaseUrl}/goods/${id}/evaluate/page`,
    data
  })
}

// 获取商品的specs和skus
export const getSpecsAndSkus = skuId => {
  return request({
    method: 'get',
    url: `/goods/sku/${skuId}`
  })
}
