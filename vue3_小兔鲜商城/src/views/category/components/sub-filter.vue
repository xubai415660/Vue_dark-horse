<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if='filterDate && !filterLoading'>
    <!-- 品牌筛选条件 -->
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
         <a @click='selectBrand(attr.id)'
         :class='{active: filterDate.brands.selectedBrand===attr.id}'
         href="javascript:;"
         v-for="attr in filterDate.brands"
         :key="attr.id">{{attr.name}}</a>
      </div>
    </div>
    <!-- 规格筛选条件 -->
    <div class="item" v-for="item in filterDate.saleProperties" :key="item.key">
      <!-- 规格数据 -->
      <div class="head">{{item.name}}：</div>
      <div class="body">
       <a @click='selectProps(item, attr)'
       :class='{active: item.selectedProp===attr.id}'
       href="javascript:;" v-for="attr in item.properties"
       :key="attr.id">{{attr.name}}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/cate.js'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SubFilter',
  // Vue3引入的新的规则，就是触发自定义事件时，需要配置自定义事件的名称，否则会有警告
  emit: ['change-filter'],
  setup (props, { emit }) {
    const route = useRoute()
    const filterDate = ref(null)
    // const myInfo = reactive({
    //   abc: {}
    // })
    // watch(myInfo, (newValue) => {
    //   console.log(newValue)
    // })
    // 骨架屏加载的状态位
    const filterLoading = ref(false)

    // 最终选中品牌
    const brandId = ref(-1)
    // 最终选中的规格
    const conditionArr = ref([])
    const selectBrand = (id) => {
      brandId.value = id
      filterDate.value.brands.selectBrand = id
      // 把选中的参数传递到父组件
      emit('change-filter', {
        brandId: brandId.value,
        arttrs: conditionArr.value
      })
    }

    // 最终选中的规格
    const selectProps = (item, attr) => {
      // 设置选中的样式
      item.selectedProp = attr.id
      // 单个条件参数
      const param = {
        groupName: item.name,
        propertyName: attr.name
      }
      // 判断是否已经存在这个数据了
      const flag = conditionArr.value.some(data => {
        if (data.groupName === item.name) {
          // 已经存在了，更新选中的值
          data.propertyName = attr.name
          // 终止继续遍历
          return true
        }
      })
      if (!flag) {
        // 不存在
        conditionArr.value.push(param)
      }
      emit('change-filter', {
        brandId: brandId.value,
        arttrs: conditionArr.value
      })
    }

    watch(() => route.params.id, (newId) => {
      // 判断是否为二级路由,防止一级分类的干扰
      if (route.path !== '/category/sub/' + newId) return
      // 当二级路由切换时，需要重现调用接口筛选数据
      filterLoading.value = true
      // 获取二级分类下面的筛选条件数据（品牌和规格参数数据）
      findSubCategoryFilter(route.params.id).then(data => {
        // 数据返回后，重置加载状态
        filterLoading.value = false
        // 品牌全部
        data.result.brands.unshift({
          id: null,
          name: '全部'
        })
        // 添加品牌的选中值的属性
        data.result.brands.selectedBrand = null
        // 销售属性全部
        data.result.saleProperties.forEach(item => {
          // 动态给每一种规则添加一个选中值的属性
          item.selectedProp = null
          item.properties.unshift({
            id: null,
            name: '全部'
          })
        })
        // 把品牌数据和规格数据进行合并
        // filterDate.value = [data.result.brands, ...data.result.saleProperties]
        filterDate.value = data.result
        // myInfo.abc = data.result
      })
    }, {
      immediate: true
    })
    // 获取筛选参数

    return { filterDate, filterLoading, selectBrand, selectProps }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton { padding: 10px 0; }
}
</style>
