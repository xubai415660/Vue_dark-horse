<template>
  <div>
  <h1>测试组件缓存</h1>
    <hr>
    <router-link to='/home/question/a'>A组件</router-link>
    <router-link to='/home/question/b'>B组件</router-link>
    <!-- 路由填充位 -->
    <!-- 被keep-alive标签包裹的组件都会缓存 -->
    <!-- 如果包裹是路由填充位，那么所有填充到该位置组件都会被缓存 -->
    <!-- 其实我们需要仅仅缓存特定的组件，而不是组件 -->
    <!-- 我们需要有一套规则:那么组件需要缓存，那些不需要 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
}
</script>
