<template>
  <div class="xtx-pagination">
    <a @click='changePage(currentPage - 1)' :class="{disabled: currentPage === 1}" href="javascript:;">上一页</a>
    <span v-if='currentPage > 3'>...</span>
    <a @click='changePage(item)' href="javascript:;" :class='{active: currentPage === item}' v-for='item in pageNumList' :key='item'>{{item}}</a>
    <span v-if='currentPage < pageCount - 2'>...</span>
    <a @click='changePage(currentPage + 1)' :class='{disabled: currentPage === pageCount}' href="javascript:;">下一页</a>
  </div>
</template>
<script>
import { ref, toRef, computed } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    pagesize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit, attrs }) {
    // 获取当前页码的初始值
    // const initPage = attrs.page
    // 实现分页逻辑
    // 1. 列表数据总数
    const total = toRef(props, 'total')
    // 2. 每页的条数
    const pagesize = toRef(props, 'pagesize')
    // 3. 动态计算总页数
    const pageCount = computed(() => Math.ceil(total.value / pagesize.value))
    // 4. 当前页码
    const currentPage = ref(attrs.page)
    // 当前显示的页码列表
    const pageNumList = computed(() => {
      const pages = []
      if (currentPage.value <= 3) {
        // 开始的页码处理
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage.value >= pageCount.value - 2) {
        // 最后的页码处理
        for (let i = pageCount.value - 4; i <= pageCount.value; i++) {
          pages.push(i)
        }
      } else {
        // 中间的页码处理
        for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
          pages.push(i)
        }
      }
      return pages
    })
    // 切换页码
    const changePage = (page) => {
      // 页码到了最左侧
      if (page === 0) return
      // 页码到了最右侧
      else if (page === pageCount.value + 1) return
      currentPage.value = page
      // 把最新的页码传递给父组件
      emit('change-page', page)
    }
    return { pageNumList, currentPage, pageCount, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
