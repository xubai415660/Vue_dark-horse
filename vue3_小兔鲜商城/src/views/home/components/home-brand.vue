<template>
<!-- 热门品牌 -->
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a href="javascript:;" class="iconfont icon-angle-left prev" :class='{disabled: index === 0}' @click='toggle(0)'></a>
      <a href="javascript:;" class="iconfont icon-angle-right next" :class='{disabled: index === 1}' @click='toggle(1)'></a>
    </template>
    <div class="box" ref="target">
    <Transition name="fade">
      <ul v-if='brands.length' class="list" :style='{transform: `translateX(${-index * 1024}px)`}'>
        <li v-for="item in brands" :key="item.id">
          <RouterLink to="/">
            <!-- <img :src="item.picture" alt=""> -->
            <!-- 图片懒加载  v-lazy -->
           <img v-lazy="item.picture" alt="">
          </RouterLink>
        </li>
      </ul>
      <div v-else class="skeleton">
        <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px" />
      </div>
    </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-pannel.vue'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // -----------------------获取数据------------------------
    // const brands = ref([])
    // findBrand(10).then(data => {
    //   brands.value = data.result
    // })
    // 注意：useLazyData需要的是API函数，如果遇到需要传参的情况，自己写函数再函数中调用API
    const { target, result } = useLazyData(() => findBrand(10))
    // 控制左右切换
    const index = ref(0)
    const toggle = (i) => {
      index.value = i
    }
    return { target, brands: result, toggle, index }
  }
}
</script>
<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
