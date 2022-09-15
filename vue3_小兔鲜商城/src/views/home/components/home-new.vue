<template>
  <div class="home-new" ref="target" >
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- 具名插槽注入右侧内容 -->
      <template #right>
        <XtxMore path="/" />
      </template>
      <!-- 面板内容：注入默认插槽中 -->
      <div style="position: relative; height: 426px;">
        <!-- 添加div相对定位，方便待会做动作 -->
        <!-- 如果goods中有数据，就显示列表数据，没有数据时，显示骨架屏组件 -->
        <Transition name="fade">
          <ul v-if="goods.length" ref="pannel" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
              <!-- 图片懒加载  v-lazy -->
                <img v-lazy="item.picture" alt="" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton bg="#f0f9f4" v-else />
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>
<script>
import { findNew } from '@/api/home'
import HomePanel from './home-pannel'
// 面板骨架效果
import HomeSkeleton from './home-skeleton.vue'
// 懒加载
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // 基于自己封装的hook方法重构数据的懒加载
    const { target, result } = useLazyData(findNew)
    return { target, goods: result }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    // 类似于函数调用（混入）
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
