<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{ goodsId ? '同类商品' : '猜你喜欢' }}推荐</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <XtxCarousel :sliders="list" auto-play duration='2' />
  </div>
</template>

<script>
import { findRelGoods } from '@/api/product.js'
import { ref } from 'vue'
const useGoodsList = goodsId => {
  const list = ref([])
  findRelGoods(goodsId).then(data => {
    // list.value = data.result
    // 原始的数据data.result一共16条数据
    // 现在需要每页显示4条
    const pageSize = 4
    // 计算出总页数
    const perPageNum = Math.ceil(data.result.length / pageSize)
    // 对原始数据数据进行分页处理
    for (let i = 0; i < perPageNum; i++) {
      // 每一页的数据
      const pageArr = data.result.slice(i * pageSize, (i + 1) * pageSize)
      list.value.push(pageArr)
    }
  })
  return list
}

export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // list = [[], [], [], []]
    const list = useGoodsList(props.goodsId)
    return { list }
  }
}
</script>

<style scoped lang="less">
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  // Vue3中深度选择器使用规则 :deep(类名)
  :deep(.xtx-carousel) {
    height: 380px;
    .carousel {
      &-indicator {
        bottom: 30px;
        span {
          &.active {
            background: @xtxColor;
          }
        }
      }
      &-btn {
        top: 110px;
        opacity: 1;
        background: rgba(0, 0, 0, 0);
        color: #ddd;
        i {
          font-size: 30px;
        }
      }
    }
  }
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
</style>
