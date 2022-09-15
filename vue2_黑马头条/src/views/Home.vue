<template>
  <div class="container">
    <!-- 内容区 -->
    <!-- 顶部导航栏 -->
  <van-nav-bar fixed title="黑马头条" right-text="搜索"
   @click-right="$router.push('/search')"/>
    <!-- 中间内容区 -->
    <div class="wrapper">
      <!-- 基于路由映射meta配置可以实现部分组件的缓存 -->
      <keep-alive>
        <router-view v-if='$route.meta.keepAlive' />
      </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
    </div>
    <!-- 底部菜单 -->
    <van-tabbar route>
      <van-tabbar-item to="/home/main" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/home/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/home/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/home/my" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="less">
// scoped 作用域
// 用于把这里的样式变成当前组件的局部样式，防止不同组件的类名的冲突
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .wrapper {
    position: absolute;
    width: 100%;
    top: 92px;
    bottom: 100px /* 100px -> 6.25rem */;
  }
}
</style>
