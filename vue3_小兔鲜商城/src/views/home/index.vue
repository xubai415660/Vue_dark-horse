<template>
  <div class="home-entry">
    <div class="container">
      <!-- 分类组件 -->
      <HomeCate />
      <!-- 轮播图组件 -->
      <HomeBanner/>
      <!-- 新鲜好物 -->
      <HomeNew />
      <!-- 人气推荐 -->
      <HomeHot />
      <!-- 热门品牌 -->
      <HomeBrand />
      <!-- 商品区域 -->
      <HomeProduct />
      <!-- 最新专题 -->
      <HomeSpecial />
    </div>
  </div>
</template>
<script>
// 分类组件
import HomeCate from './components/home-cate.vue'
// 轮播图组件
import HomeBanner from './components/home-banner.vue'
// 新鲜好物组件
import HomeNew from './components/home-new.vue'
// 人气推荐组件
import HomeHot from './components/home-hot.vue'
// 热门品牌组件
import HomeBrand from './components/home-brand.vue'
// 商品区域组件
import HomeProduct from './components/home-product.vue'
// 最新专题组件
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'XtxHomePage',
  components: {
    HomeCate,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>
<style scoped lang="less">
.home-entry {
  .container {
    width: 1240px;
    position: relative;
    margin: 0 auto;
  }
}
</style>
