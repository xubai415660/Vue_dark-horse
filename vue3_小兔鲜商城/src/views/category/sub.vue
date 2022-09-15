<template>
  <div class="sub-container">
    <div class="container">
      <!-- 面包屑导航组件 -->
      <SubBread />
      <!-- 条件筛选组件 -->
      <SubFilter @change-filter='changeFilterParams' />
      <!-- 复选框测试 -->
      <!-- <XtxCheckbox v-model="job">程序员</XtxCheckbox> {{ job }} -->
      <!-- 结果区域 -->
      <div class="goods-list">
      <!-- 排序组件 -->
         <SubSort @change-sort='changeSortParams' />
      <!-- 商品列表 -->
      <ul>
        <li v-for="item in list" :key="item.id">
           <GoodsItem :goods="item" />
        </li>
      </ul>
      <!-- 加载 -->
      <XtxInfiniteLoading :loading='loading' :finished='finished' @load='getData' />
    </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '@/api/cate.js'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    // const job = ref(true)
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const list = ref([])
    // 查询参数
    const reqParams = {
      page: 1,
      pageSize: 20
    }
    // 调用接口获取下一页数据
    const getData = () => {
      // 接口正在调用
      loading.value = true
      // 请求参数需要添加二级分类id
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(data => {
        list.value.push(...data.result.items)
        // 获取数据后，重置加载状态
        loading.value = false
        // 页码需要继续累加
        reqParams.page++
        // 是否已经全部加载完成
        if (data.result.counts === list.value.length) {
          // 没有更多数据了
          finished.value = true
        }
      })
    }
    // 侦听二级分类的切换操作
    watch(() => route.params.id, (newId) => {
      // \排除一级分类的参数变化
      if (route.path !== '/category/sub/' + newId) return
      // 清空数据即可
      list.value = []
      // 重新加载第一页数据
      reqParams.page = 1
      // 重置完成的状态
      finished.value = false
    })

    // 接收排序组件传递过来的参数
    const changeSortParams = (sortParams) => {
      // ES6的方法Object.assign，用于合并两个对象中的属性(浅拷贝)
      // 把sortParams对象中的所有属性放到reqParams对象里面
      Object.assign(reqParams, sortParams)
      // 重置数据即可(只要数据置空，加载更多的组件就会进入可视区，那么就触发load数据)
      list.value = []
      reqParams.page = 1
      loading.value = false
      finished.value = false
    }

    // 接受筛选条件传递过来的参数
    const changeFilterParams = (filterParams) => {
      // ES6的方法Object.assign，用于合并两个对象中的属性(浅拷贝)
      // 把sortParams对象中的所有属性放到reqParams对象里面
      Object.assign(reqParams, filterParams)
      reqParams.page = 1
      loading.value = false
      finished.value = false
      // 如果修改参数时，页面本来就没有数据，那么就手动调用接口
      if (list.value.length === 0) {
        getData()
      } else {
        // 重置数据即可（只要数据置空，加载更多的组件就会进入可视区，俺么就触发load数据）
        list.value = []
      }
    }
    return { getData, loading, finished, list, changeSortParams, changeFilterParams }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
