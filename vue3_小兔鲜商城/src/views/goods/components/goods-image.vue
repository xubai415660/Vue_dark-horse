<template>
  <div class="goods-image">
    <!-- 右侧放大镜 -->
    <div v-show='isShow' class="large" :style='[{backgroundImage: `url(${images[currIndex]})`}, imgPostion]'></div>
    <!-- 左侧的中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!-- 遮罩层 -->
       <div class="layer" v-show='isShow' :style='layerPostion'></div>
    </div>
    <ul class="small">
        <!-- 右侧5张小图 -->
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, watch, reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    const target = ref(null)
    const isShow = ref(false)
    // elementX 鼠标基于容器左上角X轴偏移
    // elementY 鼠标基于容器左上角Y轴偏移
    // isOutside 鼠标是否在模板容器外
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 控制左侧遮罩层位置
    const layerPostion = reactive({ left: 0, top: 0 })
    // 控制右侧预览图的位置:通过样式属性控制图片作为背景图的位置
    const imgPostion = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })
    // 实时监控鼠标在图片中位置的变化
    watch([elementX, elementY, isOutside], (info) => {
      // 控制显示和隐藏预览图
      isShow.value = !isOutside.value
      if (isOutside.value) return
      // 计算遮罩层的位置
      if (elementX.value < 100) {
        // x方向左边界
        layerPostion.left = 0
      } else if (elementX.value > 300) {
        // x方向右边界
        layerPostion.left = 200
      } else {
        // 临界与100和300之间
        layerPostion.left = elementX.value - 100
      }
      if (elementY.value < 100) {
        // y方向左边界
        layerPostion.top = 0
      } else if (elementY.value > 300) {
        // y方向右边界
        layerPostion.top = 200
      } else {
        // 临界与100和300之间
        layerPostion.top = elementY.value - 100
      }
      // 控制右侧预览图的背景位置
      imgPostion.backgroundPositionX = -layerPostion.left * 2 + 'px'
      imgPostion.backgroundPositionY = -layerPostion.top * 2 + 'px'
      // 设置遮罩容器的定位
      layerPostion.left = layerPostion.left + 'px'
      layerPostion.top = layerPostion.top + 'px'
    })
    return { target, currIndex, layerPostion, imgPostion, isShow }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
    z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
 }
  .middle {
    width: 400px;
    height: 400px;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
