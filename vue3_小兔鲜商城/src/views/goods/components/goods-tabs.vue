<template>
  <div class="goods-tabs">
    <nav>
      <a @click='toggle("GoodsDetail")' :class="{active: componentName === 'GoodsDetail'}" href="javascript:;">商品详情</a>
      <a @click='toggle("GoodsComment")' :class="{active: componentName === 'GoodsComment'}" href="javascript:;">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方 -->
    <!-- <GoodsDetail v-if='currentIndex === 0'/> -->
    <!-- <GoodsComment v-if='currentIndex === 1'/> -->
    <!-- 基于动态组件控制组件的切换 -->
    <component :is='componentName'></component>
  </div>
</template>
<script>
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
import { ref, inject } from 'vue'
export default {
  name: 'GoodsTabs',
  components: { GoodsDetail, GoodsComment },
  setup () {
    // 当前组件的名称
    const componentName = ref('GoodsDetail')
    const toggle = (name) => {
      componentName.value = name
    }
    // 获取商品数据
    const goods = inject('goods')
    console.log(goods.value.commentCount)
    return { toggle, componentName, goods }
  }
}
</script>
<style scoped lang='less'>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: '';
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
