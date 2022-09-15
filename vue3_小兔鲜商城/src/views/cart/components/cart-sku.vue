<template>
  <div class="cart-sku" ref='target'>
    <div class="attrs" @click='toggle'>
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <!-- 如果规格数据存在就渲染规格内容，否则显示loading效果 -->
      <div v-if="!goods" class="loading"></div>
      <GoodsSku v-if="goods" :skuId="skuId" :skus="goods.skus" :specs='goods.specs' @sku-info='changeSku' />
      <XtxButton @click='submit' v-if="goods" type="primary" size="mini" style="margin-left:60px">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { getSpecsAndSkus } from '@/api/product.js'
import { onClickOutside } from '@vueuse/core'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { useStore } from 'vuex'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    // 根据SKUId获取的商品规格数据
    const goods = ref(null)
    const visible = ref(false)
    const target = ref(null)
    const store = useStore()
    onClickOutside(target, () => {
      // 点击target指定的DOM之外的区域，触发回调函数:隐藏弹窗
      visible.value = false
      goods.value = null
    })
    // 控制显示和隐藏弹窗
    const toggle = () => {
      visible.value = !visible.value
      if (!visible.value) {
        // 关闭弹窗，重置goods数据
        goods.value = null
      }
      getSpecsAndSkus(props.skuId).then(ret => {
        goods.value = ret.result
      })
    }
    // 获取变化后的sku值
    const currentSku = ref(null)
    // 获取变化后的sku信息
    const changeSku = (sku) => {
      currentSku.value = sku
    }
    // 更新sku信息:点击确定之后的动作
    const submit = () => {
      // 判断当前选中的sku信息是否完整
      if (currentSku.value && currentSku.value.skuId && currentSku.value.skuId !== props.skuId) {
        // 直接触发action，更新sku即可
        store.dispatch('cart/updateCartSku', { skuId: props.skuId, sku: currentSku.value })
        // 关闭弹窗
        visible.value = false
      }
    }
    return { visible, toggle, target, goods, changeSku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
