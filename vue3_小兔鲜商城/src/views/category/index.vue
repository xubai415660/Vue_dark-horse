<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑导航 -->
      <transition name="fade-right" mode="out-in">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
       <XtxBreadItem key="currentCate.id">{{ currentCate.name }}</XtxBreadItem>
      </XtxBread>
      </transition>
      <!-- 轮播图 -->
      <!-- 动态绑定的基本类型的数据可以保证是对应的类型 -->
       <XtxCarousel :sliders="sliders" auto-play duration='2' style="height:500px"/>
      <!-- 全部二级分类  -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in currentCate.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 分类关联的商品 -->
      <div class="ref-goods" v-for="item in goods" :key="item.id">
        <div class="head">
          <h3>- {{item.name}} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem :info='info' v-for="info in item.goods" :key="info.id" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/cate'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
export default {
  name: 'FirstCategory',
  components: { GoodsItem },
  setup () {
    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    // 面包屑+所有分类
    const store = useStore()
    // route相当于之前的this.$route
    const route = useRoute()
    // 根据当前点击一级分类获取分类的详细数据
    const currentCate = computed(() => {
      const cate = store.state.cate.list.find(item => {
        // route相当于之前的this.$route
        return item.id === route.params.id
      })
      return cate || {}
    })
    // 获取一级分类相关的商品数据
    const goods = ref([])
    // 只要路由参数 params.id值发生变化，那么就会触发侦听（一级和二级分类都是动态路由）
    watch(() => route.params.id, (newId) => {
      // 屏蔽掉二级分类路由参数的变化
      if (route.path.indexOf('/category/sub') !== -1) return
      findTopCategory(newId).then(data => {
        goods.value = data.result.children
      })
    }, {
      immediate: true
    })
    return { sliders, currentCate, goods }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
