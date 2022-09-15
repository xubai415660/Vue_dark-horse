<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="list">
      <GoodsItem v-for="item in list" :key="item.id" :info="item" />
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
import { findHotGoods } from '@/api/product.js'
import GoodsItem from '@/views/category/components/goods-item.vue'
export default {
  name: 'GoodsHot',
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1
    },
    goodsId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    // 数据列表
    const list = ref([])
    // 获取热销列表数据
    findHotGoods({
      id: props.goodsId,
      type: props.type
    }).then(data => {
      list.value = data.result
    })
    // 热销榜名称
    const titleObj = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    // 计算标题的内容
    const title = computed(() => {
      return titleObj[props.type]
    })
    return { title, list }
  }
}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
