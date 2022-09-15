<template>
  <div>
    <!-- 顶部的通栏 -->
    <TopNav />
    <!-- 顶部导航布局（头部组件） -->
    <TopHeader />
    <!-- 吸顶组件 -->
    <HeaderSticky />
    <main class="app-main">
      <!-- 二级路由出口 -->
      <router-view></router-view>
    </main>
    <!-- 底部footer -->
    <BottomFooter />
  </div>
</template>

<script>
// 顶部通栏 top
import TopNav from './components/topnav'
// 头部组件 header
import TopHeader from './components/header'
// 底部组件 footer
import BottomFooter from './components/footer'
// 吸顶组件
import HeaderSticky from './components/header-sticky'

export default {
  name: 'XtxLayout',
  components: {
    TopNav,
    TopHeader,
    BottomFooter,
    HeaderSticky
  }
}
</script>

<style scoped lang="less">
.app-main {
  min-height: 600px;
}
</style>
