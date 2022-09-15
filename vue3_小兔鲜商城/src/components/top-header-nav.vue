<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
   <li :key='item.id' v-for='item in list' @mousemove="show(item.id)" @mouseleave="hide(item.id)">
    <!-- 路由跳转：一级分类 -->
    <RouterLink @click="hide(item.id)" :to="'/category/' + item.id">{{item.name}}</RouterLink>
      <div class="layer" :class='{open: item.open}'>
        <ul>
          <li v-for="cate in item.children" :key="cate.id">
        <!-- 路由跳转：二级分类 -->
          <RouterLink @click="hide(item.id)" :to='"/category/sub/" + cate.id'>
              <img :src="cate.picture" alt="" />
              <p>{{ cate.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { onMounted, computed } from 'vue'
// 从vuex中导入一个函数 useStore 返回值就是一个store实例对象
import { useStore } from 'vuex'

export default {
  name: 'AppHeaderNav',
  setup () {
    // 获取store对象
    const store = useStore()
    // 生命周期函数中触发action
    onMounted(() => {
      // 触发action函数的执行
      store.dispatch('cate/setList')
    })
    // 通过计算属性的方式获取Store中的数据
    const list = computed(() => {
      return store.state.cate.list
    })
    // 控制二级分类的显示
    const show = (id) => {
      store.commit('cate/show', id)
    }
    // 控制二级分类的隐藏
    const hide = (id) => {
      store.commit('cate/hide', id)
    }
    return { list, show, hide }
  }
}
</script>

<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 999;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
    // 初始样式 不显示
    .layer {
      // &.open { height: 132px; opacity: 1; }
      width: 1240px;
      background-color: #fff;
      position: absolute;
      left: -200px;
      top: 56px;
      height: 0;
      overflow: hidden;
      opacity: 0;
      box-shadow: 0 0 5px #ccc;
      transition: all 0.2s 0.1s;
      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 70px;
        align-items: center;
        height: 135px;
        li {
          width: 110px;
          text-align: center;
          img {
            width: 60px;
            height: 60px;
          }
          p {
            padding-top: 10px;
          }
          &:hover {
            p {
              color: @xtxColor;
            }
          }
        }
      }
    }
    // hover之后显示出来
    &:hover {
         // 加上 >
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      > .layer {
        height: 124px;
        opacity: 1;
      }
    }
  }
}

</style>
