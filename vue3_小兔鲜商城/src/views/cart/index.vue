<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox @change='toggleAll' :modelValue='$store.getters["cart/isAllCart"]'>全选</XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length===0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr v-else v-for="item in $store.getters['cart/validList']" :key="item.skuId">
              <td>
                <XtxCheckbox @change='toggleOne(item.skuId, $event)' :modelValue='item.selected' />
              </td>
              <td>
                <div class="goods">
                  <RouterLink to="/">
                    <img :src="item.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{item.name}}</p>
                    <!-- 选择规格组件 -->
                    <!-- <p class="attr">{{item.attrsText}}</p> -->
                    <CartSku :attrsText='item.attrsText' :skuId='item.skuId' />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{item.nowPrice}}</p>
                <p>比加入时降价 <span class="red">&yen;20.00</span></p>
              </td>
              <td class="tc">
                <XtxNumbox @change='changeCount(item.skuId, $event)' :modelValue="item.count" :max='item.stock' />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{item.nowPrice * item.count}}</p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click='deleteCart(item.skuId)'>删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length>0">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="item in $store.getters['cart/validList']" :key="item.skuId">
              <td>
                <XtxCheckbox style="color:#eee;" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`">
                    <img :src="item.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{item.name}}</p>
                    <p class="attr">{{item.attrsText}}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{item.nowPrice}}</p>
              </td>
              <td class="tc">{{item.count}}</td>
              <td class="tc">
                <p>&yen;{{item.nowPrice*100*item.count/100}}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox @change='toggleAll' :modelValue='$store.getters["cart/isAllCart"]'>全选</XtxCheckbox>
          <a href="javascript:;" @click='batchDeleteCart(false)'>删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click='batchDeleteCart(true)'>清空失效商品</a>
        </div>
        <div class="total">
          共 {{$store.getters['cart/validCount']}} 件商品，已选择 {{$store.getters['cart/selectedCount']}} 件，商品合计：
          <span class="red">¥{{$store.getters['cart/selectedTotal']}}</span>
          <XtxButton type="primary" @click='goCheckout'>下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import CartNone from './components/cart-none.vue'
import CartSku from './components/cart-sku.vue'
import Confirm from '@/components/library/Confirm.js'
import Message from '@/components/library/Message.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const router = useRouter()
    const store = useStore()
    // 实现单个商品的选中控制
    const toggleOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 实现所有商品的选中控制
    const toggleAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 根据SKUId删除商品
    const deleteCart = (skuId) => {
      // store.dispatch('cart/deleteCart', skuId)
      Confirm({ title: '确认消息', text: '确认要删除该商品吗？' })
        .then(() => {
          // 点击确定
          store.dispatch('cart/deleteCart', skuId)
        }).catch(() => {
          console.log('取消')
        })
    }
    // 批量删除选中商品
    const batchDeleteCart = (isClear) => {
      Confirm({ title: '确认消息', text: `确认要删除${isClear ? '失效' : '选中'}商品吗？` })
        .then(() => {
          // 点击确定
          store.dispatch('cart/batchDeleteCart', isClear)
        }).catch(() => {
          console.log('取消')
        })
    }
    // 修改商品的数量
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 跳转到结算页面
    const goCheckout = () => {
      // 1、判断是否选择了商品
      if (store.getters['cart/selectedTotal'] === 0) {
        return Message({ type: 'error', text: '请选择商品' })
      }
      // 2、判断是否已经登录了
      if (!store.state.user.profile.token) {
        Confirm({ title: '确认消息', text: '确认要去登录吗？' })
          .then(() => {
            // 如果添加了导航守卫，可以直接跳转到结算页面，导航守卫中重定向到登录页面
            router.push('/member/checkout')
          }).catch(() => {
            console.log('取消')
          })
      } else {
        // 如果已经登录了，跳转到结算页面
        router.push('/member/checkout')
      }
    }
    return { toggleOne, toggleAll, deleteCart, batchDeleteCart, changeCount, goCheckout }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
