import request from '@/utils/request'

// 获取结算信息
export const findCheckoutInfo = () => {
  return request({
    method: 'get',
    url: '/member/order/pre'
  })
}

// 生成订单
export const createOrder = order => {
  return request({
    method: 'post',
    url: '/member/order',
    data: order
  })
}

// 根据订单id获取订单数据
export const findOrder = id => {
  return request({
    method: 'get',
    url: '/member/order/' + id
  })
}
