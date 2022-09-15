import request from '@/utils/request.js'
// 分类商品数据接口
// 根据一级分类的id获取一级分类的详细数据（包括相关的商品数据）
export const findTopCategory = id => {
  return request({
    method: 'get',
    url: '/category',
    data: { id }
  })
}

// 获取二级分类筛选条件数据
export const findSubCategoryFilter = (id) => {
  return request({
    method: 'get',
    url: '/category/sub/filter',
    data: { id }
  })
}

// 二级分类下商品的筛选接口
export const findSubCategoryGoods = (data) => {
  return request({
    method: 'post',
    url: '/category/goods/temporary',
    data
  })
}
