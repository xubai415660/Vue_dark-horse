<template>
  <div class='xtx-goods-page' v-if='goodsDetail'>
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/'+goodsDetail.categories[1].id">{{goodsDetail.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/'+goodsDetail.categories[0].id">{{goodsDetail.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem>{{goodsDetail.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 图片预览 -->
         <GoodsImage :images='goodsDetail.mainPictures' />
         <!-- 商品的销售信息 -->
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 商品的名称 -->
           <GoodsName :goods='goodsDetail' />
           <!-- 控制商品的规格参数 -->
            <!-- skuId='1369155873162661889'  -->
           <GoodsSku @sku-info='skuInfo' :specs='goodsDetail.specs'  :skus='goodsDetail.skus' />
          <!-- 控制商品数量组件 -->
           <XtxNumbox v-model='num' label='数量' :max='goodsDetail.inventory' />
           <!-- 加入按购车按钮 -->
           <!-- 组件上面绑定的原生属性会自动绑定到组件的根节点上 -->
            <XtxButton @click="insertCart" :style='{marginTop: "20px"}' type='primary'>加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId='goodsDetail.id'  />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
             <GoodsTabs />
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
              <GoodsWarn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type='1' :goodsId='goodsDetail.id' />
          <GoodsHot :type='2' :goodsId='goodsDetail.id' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, provide, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { findGoods } from '@/api/product.js'
import { useRoute } from 'vue-router'
import Massage from '@/components/library/Message.js'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn'
const useGoods = () => {
  const goodDetail = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newId) => {
    findGoods(newId).then(data => {
      goodDetail.value = null
      // 保证之前的商品数据先清空，然后，再重新赋值新的数据
      nextTick(() => {
        goodDetail.value = data.result
      })
    })
  }, {
    immediate: true
  })
  return goodDetail
}

export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    // 获取当前组件的实例
    const instance = getCurrentInstance()
    // 当前选中的规格
    const currentSku = ref(null)
    // store实例
    const store = useStore()
    // 简化setup中的代码，方便代码的重用和后期的维护
    const goodsDetail = useGoods()
    // 注入数据给子孙
    provide('goods', goodsDetail)
    const num = ref(1)
    const skuInfo = (sku) => {
      if (sku.skuId) {
        goodsDetail.value.price = sku.price
        goodsDetail.value.oldPrice = sku.oldPrice
        goodsDetail.value.inventory = sku.inventory
        // 记录当前选中的sku信息
        currentSku.value = sku
      } else {
        currentSku.value = null
      }
    }
    // 加入购物车
    const insertCart = () => {
      // 判断是否选中了规格
      if (!currentSku.value) {
        // 进行消息提示
        return Massage({ type: 'warn', text: '请选择规格' })
      }
      // 判断是否还有库存
      if (num.value > goodsDetail.inventory) {
        // 库存不够，进行提示
        // instance.proxy表示组件的实例对象
        return instance.proxy.$message({ type: 'warn', text: '库存不够' })
        // return Massage({ type: 'warn', text: '库存不够' })
      }
      // 触发加入购物车的action
      // 加入购物车的信息 id skuId name picture price nowPrice count attrsText selected stock isEffective
      const goodsInfo = {
        // 当前商品的id
        id: goodsDetail.value.id,
        // 加入购物车的商品的skuId
        skuId: currentSku.value.skuId,
        // 商品名称
        name: goodsDetail.value.name,
        // 商品的第一张图片,在购物进行显示
        picture: goodsDetail.value.mainPictures[0],
        // 默认价格
        price: currentSku.value.price,
        // 当前价格
        nowPrice: currentSku.value.price,
        // 购买的数量
        count: num.value,
        // 规格参数
        attrsText: currentSku.value.specsText,
        // 当前商品是否选中:默认设置为选中，用于支付
        selected: true,
        // 当前库存
        stock: currentSku.value.inventory,
        // 当前商品是否有效:默认值有效，这个商品依然在售
        isEffective: true
      }
      store.dispatch('cart/insertCart', goodsInfo)
      instance.proxy.$message({ type: 'success', text: '加入成功' })
    }
    return { goodsDetail, skuInfo, num, insertCart }
  }
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
