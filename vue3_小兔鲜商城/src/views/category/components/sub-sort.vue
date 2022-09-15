<template>
  <div class="sub-sort">
    <div class="sort">
      <a @click="handleSort()" :class="{active:sortParams.sortField===null}" href="javascript:;">默认排序</a>
      <a @click="handleSort('publishTime')" :class="{active:sortParams.sortField==='publishTime'}" href="javascript:;">最新商品</a>
      <a @click="handleSort('orderNum')" :class="{active:sortParams.sortField==='orderNum'}" href="javascript:;">最高人气</a>
      <a @click="handleSort('evaluateNum')" :class="{active:sortParams.sortField==='evaluateNum'}" href="javascript:;">评论最多</a>
      <a @click="handleSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod=='asc'}" />
        <i class="arrow down" :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod=='desc'}"  />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox  v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox  v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive, watch } from 'vue'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 排序相关的参数
    const sortParams = reactive({
      // sortField的取值由后端决定
      sortField: null,
      // 价格排序的顺序 asc/desc
      sortMethod: null,
      // 是否有货
      inventory: false,
      //  是否打折
      onlyDiscount: false
    })
    // 点击排序
    const handleSort = (type) => {
      if (type === 'price') {
        // 价格排序
        if (sortParams.sortMethod === null) {
          // 默认设置为降序排列
          sortParams.sortMethod = 'desc'
        } else {
          // 本来有排序规则：把原来的排序进行取反处理即可
          sortParams.sortMethod = sortParams.sortMethod === 'asc' ? 'desc' : 'asc'
        }
      } else {
        // 如果不选择价格，就把属性置空
        sortParams.sortMethod = null
      }
      // 非价格的其他排序方式
      sortParams.sortField = type
    }

    // 侦听排序相关参数的变化
    watch(sortParams, (newValue) => {
      // 把子组件选中的数据传递给父组件
      emit('change-sort', newValue)
    })
    return { sortParams, handleSort }
  }
}
</script>
<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
