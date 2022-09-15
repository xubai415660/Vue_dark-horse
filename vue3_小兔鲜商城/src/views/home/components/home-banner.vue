<template>
  <div class="home-banner">
    <!-- 轮播图组件 -->
    <!-- 动态绑定的基本类型的数据可以保证是对应的类型 -->
    <XtxCarousel :sliders="sliders" auto-play duration='2' />
  </div>
</template>
<script>
import { ref } from 'vue'
import { findBanner } from '@/api/home.js'
export default {
  name: 'HomeBanner',
  setup () {
    const sliders = ref([])
    // 调用接口获取轮播图数据
    findBanner().then(ret => {
      sliders.value = ret.result
    })
    return { sliders }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    ::v-deep .carousel-btn.prev {
      left: 270px;
    }
    ::v-deep .carousel-indicator {
      padding-left: 250px;
    }
  }
}
</style>
