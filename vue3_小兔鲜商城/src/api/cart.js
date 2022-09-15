import request from '@/utils/request'

//  获取新的商品信息(根据规格的skuId)
export const getNewCartGoods = (skuId) => {
  return request({
    method: 'get',
    url: `/goods/stock/${skuId}`
  })
}

// 把本地购物车数据上传到服务器
export const mergeLocalCart = (cartList) => {
  return request({
    method: 'post',
    url: '/member/cart/merge',
    data: cartList
  })
}

// 获取服务器中购物车列表数据
export const findCartList = () => {
  return request({
    method: 'get',
    url: '/member/cart'
  })
}

// 加入购物车
export const insertCart = ({ skuId, count }) => {
  return request({
    method: 'post',
    url: '/member/cart',
    data: { skuId, count }
  })
}

// 删除购物车中的多个商品
export const deleteCart = (ids) => {
  return request({
    method: 'delete',
    url: '/member/cart',
    data: { ids }
  })
}

// 修改单件商品的选中状态和数量
// goods参数包括：skuId,selected,count
export const updateCart = goods => {
  return request({
    method: 'put',
    url: '/member/cart/' + goods.skuId,
    data: goods
  })
}

// 控制商品的全选和反选
export const checkAllCart = ({ selected, ids }) => {
  return request({
    method: 'put',
    url: '/member/cart/selected',
    data: { selected, ids }
  })
}
