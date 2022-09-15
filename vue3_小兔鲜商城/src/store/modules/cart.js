import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart.js'
import Massage from '@/components/library/Message.js'

// 购物车模块
export default {
  namespaced: true,
  state: () => {
    return {
      title: '购物车模块',
      list: []
    }
  },
  mutations: {
    // 更新购物车数据:用于清空购物车
    setCartList (state, list) {
      state.list = list
    },
    // 删除顶部购物车单独的一件商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      if (index !== -1) {
        // 删除数组中一个元素
        state.list.splice(index, 1)
      }
    },
    // 更新购物车指定的商品的最新信息
    updateCart (state, goods) {
      console.log(goods)
      // goods表示根据skuId查询出的最新商品的信息
      // 获取需要更新的商品的信息
      const currentGoods = state.list.find(item => item.skuId === goods.skuId)
      // 遍历goods中的每一个属性，覆盖当前规格的商品的信息
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          // 获取的商品属性如果是非空的就进行更新
          currentGoods[key] = goods[key]
        }
      }
    },
    updateTitle (state, payload) {
      state.title = payload
    },
    // 把商品添加到购物车
    insertCart (state, goods) {
      // goods参数表示商品详情信息（包含我们需要的相关参数）
      // 如果多次加入同一件商品，那么需要进行商品数量的累加操作
      // 根据skuId判断是否是同一件商品
      const index = state.list.findIndex(item => item.skuId === goods.skuId)
      if (index !== -1) {
        // 有这件商品，进行商品数量的累加操作
        goods.count = state.list[index].count + 1
        // 删除原来的商品
        state.list.splice(index, 1)
      }
      state.list.unshift(goods)
    }
  },
  actions: {
    // 合并本地购物车数据到服务器
    async mergeLocalCart (context) {
      // 获取购物车商品列表的有效数据
      const cartList = context.getters.validList.map(item => {
        console.log(item)
        return {
          skuId: item.skuId, selected: item.selected, count: item.count
        }
      })
      // 调用接口进行同步即可
      await mergeLocalCart(cartList)
      // 清空本地购物车数据
      context.commit('setCartList', [])
    },
    // 根据skuId更新商品的规格参数
    updateCartSku (context, goods) {
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录：先删除之前的商品，然后把更新的规格商品再插入
        const oldGoods = context.state.list.find(item => item.skuId === goods.skuId)
        deleteCart([oldGoods.skuId])
          .then(() => {
            // 插入一条新的数据
            insertCart({ skuId: goods.sku.skuId, count: oldGoods.count })
          })
          .then(() => {
            // 查询最新数据
            return findCartList()
          })
          .then(ret => {
            // 更新查询的结果
            context.commit('setCartList', ret.result)
          })
      } else {
        // 没有登录
        // 1、根据skuId查询之前的商品数据
        const oldGoods = context.state.list.find(item => item.skuId === goods.skuId)
        // 2、删除之前的商品
        context.commit('deleteCart', goods.skuId)
        // 3、准备要更新数据
        const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = goods.sku
        // 用新的数据覆盖旧的数据
        const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
        // 4、加入准备要更新的商品数据
        context.commit('insertCart', newGoods)
      }
    },
    // 批量删除选中的商品
    batchDeleteCart (context, isClear) {
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录：获取无效的商品ids或者选中的商品的ids
        const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
        deleteCart(ids)
          .then(() => {
            return findCartList()
          })
          .then(ret => {
            context.commit('setCartList', ret.result)
          })
      } else {
        // 未登录
        // 遍历所有有效的选中的商品列表，分别进行删除
        context.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
          context.commit('deleteCart', item.skuId)
        })
      }
    },
    // 控制所有商品的选中和反选
    checkAllCart (context, selected) {
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录：获取有效列表中的所有的商品的ids
        const ids = context.getters.validList.map(item => item.skuId)
        checkAllCart({ selected, ids })
          .then(() => {
            return findCartList()
          })
          .then(ret => {
            context.commit('setCartList', ret.result)
          })
      } else {
        // 未登录
        // 遍历所有有效的商品列表，分别进行状态的切换即可
        context.getters.validList.forEach(item => {
          context.commit('updateCart', { skuId: item.skuId, selected })
        })
      }
    },
    // 修改购物车商品
    // 1. 切换单个商品的选中状态
    // 2、控制商品数量的变化
    updateCart (context, goods) {
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录:切换单个商品的选中状态；控制商品数量的变化
        updateCart(goods)
          .then(() => {
            return findCartList()
          })
          .then(ret => {
            context.commit('setCartList', ret.result)
          })
      } else {
        // 未登录
        context.commit('updateCart', goods)
      }
    },
    // 删除顶部购物车的单件商品
    deleteCart (context, skuId) {
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录:先删除，再查询
        deleteCart([skuId])
          .then(() => {
            return findCartList()
          })
          .then(ret => {
            context.commit('setCartList', ret.result)
          })
      } else {
        // 未登录
        context.commit('deleteCart', skuId)
      }
    },
    // 更新商品最新信息的action
    findCartList (context) {
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录，获取购物车列表数据
        findCartList().then(ret => {
          // 更新本地购物车数据
          context.commit('setCartList', ret.result)
        })
      } else {
        // 未登录
        // 遍历每一件购物车的商品，分别查询每一件商品的最新信息
        const promiseArr = []
        context.state.list.forEach(item => {
          const ret = getNewCartGoods(item.skuId)
          promiseArr.push(ret)
        })
        // 并发触发多个异步任务，所有任务的结果获取后，可以通过then的回调的参数result得到所有的结果
        Promise.all(promiseArr).then(result => {
          // result表示所有商品的查询结果
          result.forEach((goods, i) => {
            context.commit('updateCart', {
              skuId: context.state.list[i].skuId,
              ...goods.result
            })
          })
        }).catch(() => {
          // 获取购物车最新商品数据失败
          // console.log(err)
          Massage({ type: 'error', text: '获取购物车最新商品数据失败' })
        })
      }
    },
    // action方法触发后的默认返回值是Promise实例对象
    insertCart (context, goods) {
      // 判断当前用户是否处于登录状态
      // context.rootState可以获取所有的模块的状态
      const token = context.rootState.user.profile.token
      if (token) {
        // 已经登录，调用接口加入购物车
        insertCart({ skuId: goods.skuId, count: goods.count })
          .then(() => {
            // 查询最新的购物车数据
            return findCartList()
          })
          .then(ret => {
            // 把查询到最新购物车数据更新到本地
            context.commit('setCartList', ret.result)
          })
      } else {
        // 尚未登录，添加商品到本地购物车
        context.commit('insertCart', goods)
      }
    }
  },
  getters: {
    // 判断当前全选按钮的状态
    isAllCart (state, getters) {
      // 判断是否所有的商品都是选中的
      // 数组的方法every表示所有数据项都满足条件才返回true
      return getters.validList.every(item => item.selected)
    },
    // 选中商品的总价格
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((total, item) => total + item.nowPrice * item.count, 0)
    },
    // 选中的商品的数量
    selectedCount (state, getters) {
      return getters.selectedList.reduce((count, item) => count + item.count, 0)
    },
    // 选中的商品列表（需要付款）
    selectedList (state) {
      return state.list.filter(item => item.selected)
    },
    // 无效的商品列表: 没有库存的；状态是失效的
    invalidList (state) {
      return state.list.filter(item => item.stock === 0 || !item.isEffective)
    },
    // 有效的商品列表
    validList (state) {
      // 过滤有效的商品：有库存 stock ；商品有效 isEffective
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 计算购物车有效商品的数量
    validCount (state, getters) {
      // 参数二getters包含了所有的可以访问的getters
      // let count = 0
      // getters.validList.forEach(item => {
      //   count += item.count
      // })
      // return count
      // --------------------------------------------------------
      // reduce参数二 0 表示count的初始值
      return getters.validList.reduce((count, item) => count + item.count, 0)
    },
    // 计算商品的总价
    validTotal (state, getters) {
      // 总价 + 单价 * 数量
      return getters.validList.reduce((total, item) => total + item.nowPrice * item.count, 0)
    }
  }
}
