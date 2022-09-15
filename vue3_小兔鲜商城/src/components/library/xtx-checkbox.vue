<template>
  <div class="xtx-checkbox" @click="toggleSelect()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span>
      <slot />
    </span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
// import { toRef } from 'vue'

export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 父组件将原始的状态值传递给子组件并且保证响应式能力
    const checked = useVModel(props, 'modelValue', emit)
    const toggleSelect = () => {
      // 这个操作实际上修改的是父组件的值
      const newValue = !checked.value
      checked.value = newValue
      // 触发change事件
      emit('change', newValue)
    }
    return { checked, toggleSelect }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
