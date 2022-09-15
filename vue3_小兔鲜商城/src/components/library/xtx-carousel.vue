<template>
<!-- 轮播图 -->
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <!-- 轮播图所有图片 -->
     <ul class="carousel-body">
      <li class="carousel-item" :class='{fade: index === i}' :key='item.id' v-for='(item, i) in sliders'>
        <RouterLink v-if='item.imgUrl'  :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
         <!-- 显示商品推荐的布局 -->
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 两侧的小按钮 -->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <a  @click="toggle(1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <!-- 指示器（小圆点） -->
    <div class="carousel-indicator">
      <span v-for="i in sliders.length" :key="i" :class='{active: index === i - 1}'></span>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    sliders: {
      type: Array,
      default: () => []
    },
    // 轮播的时间间隔
    duration: {
      type: Number,
      default: 2000
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    // 默认显示的图片的索引
    const index = ref(1)

    // 实现自动轮播功能
    let timer = null
    const autoPlayAction = () => {
      if (timer) clearInterval(timer)
      timer = setInterval(() => {
        // 实现轮播功能
        index.value++
        if (index.value >= props.sliders.length) {
        // 轮播到最后重新开始
          index.value = 0
        }
      }, props.duration * 1000)
    }

    // 基于侦听器控制启动轮播
    watch(() => props.sliders, () => {
      // 有数据&开启自动播放，才调用自动播放函数
      if (props.autoPlay && props.sliders.length > 1) {
        index.value = 0
        autoPlayAction()
      }
    }, { immediate: true })

    // 停止轮播（鼠标进入停止，移出开启自动，前提条件：autoplay为true）
    const stop = () => {
      if (timer)clearInterval(timer)
    }
    // 启动轮播
    const start = () => {
      if (props.autoPlay && props.sliders.length > 1) {
        autoPlayAction()
      }
    }
    // 手动点击左右滑动
    const toggle = (i) => {
      index.value += i
      //  判断左边界
      if (index.value < 0) {
        index.value = props.sliders.length - 1
        return
      }
      if (index.value >= props.sliders.length) {
        index.value = 0
      }
    }
    // 销毁定时器(组件消耗，清理定时器)
    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })
    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      // 轮播商品
      .slider {
        display: flex;
        justify-content: space-around;
        padding: 0 40px;
        > a {
          width: 240px;
          text-align: center;
          img {
            padding: 20px;
            width: 230px !important;
            height: 230px !important;
          }
          .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
          }
          .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
          }
        }
      }
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
