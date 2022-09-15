<template>
  <div class="xtx-numbox">
    <div class="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click='toggle(-1)'>-</a>
      <!-- <input type="text" readonly :value="modelValue===0?1:modelValue"> -->
      <input type="text" readonly :value="n===0?1:n">
      <a href="javascript:;" @click='toggle(1)'>+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    }
  },
  setup (props, { emit }) {
    const n = useVModel(props, 'modelValue', emit)
    // 控制商品数量变更
    const toggle = (step) => {
      let num = props.modelValue + step
      if (num <= 1) {
        // 控制最小值
        num = 1
      } else if (num >= props.max) {
        // 控制最大值
        num = props.max
      }
      // emit('update:modelValue', num)
      n.value = num
      // 通过change事件把计算的值传递回父组件
      emit('change', num)
    }
    return { toggle, n }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
