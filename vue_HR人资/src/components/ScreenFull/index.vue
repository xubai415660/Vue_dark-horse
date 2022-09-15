<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon title="全屏" :icon-class="isFullScreen?'exit-fullscreen':'fullscreen'" class="fullscreen" @click="toggleScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  name: 'ScreenFull',
  data () {
    return {
      isFullScreen: false
    }
  },
  methods: {
    // 触发全屏切换
    toggleScreen () {
      // 进入全屏和退出全屏都是调用该方法（这个方法的内容维持了当前是否全屏的状态）
      if (ScreenFull.isEnabled) {
        // 浏览器支持全屏
        ScreenFull.toggle()
        // 基于ScreenFull的方法实现状态控制
        this.isFullScreen = !this.isFullScreen
      } else {
        // 浏览器不支持全屏
        this.$message.error('不支持全屏')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
