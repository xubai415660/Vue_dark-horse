<template>
  <div class="home-category" @mouseenter="categoryId=null">
    <!--左侧分类列表 -->
    <ul class="menu">
      <li :class='{active: categoryId === item.id}' v-for="item in list" :key="item.id" @mouseenter="categoryId=item.id">
        <!-- 一级分类 -->
        <RouterLink to="/">{{ item.name }}</RouterLink>
        <!-- 二级分类 -->
        <template v-if="item.children">
          <RouterLink v-for="sub in item.children" :key="sub.id" :to="`/category/sub/${sub.id}`">
            {{ sub.name }}
          </RouterLink>
        </template>
        <!-- 骨架效果 -->
        <span v-else>
          <!-- 当分类数据尚未返回时，显示这里的内容：骨架屏 -->
          <XtxSkeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)" />
          <XtxSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </span>
      </li>
    </ul>
    <!-- 分类悬停是弹层效果  （分类数据、品牌数据） -->
    <div class="layer">
      <!-- 插值表达式中的切运算两侧需要空格 -->
      <h4>{{currentCategory && currentCategory.id==='brand'?'品牌': '分类'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 分类数据 -->
      <ul v-if="currentCategory && currentCategory.goods && currentCategory.goods.length">
        <li v-for="item in currentCategory.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌数据 -->
      <ul v-else-if='currentCategory && currentCategory.brands && currentCategory.brands.length'>
        <li class="brand" v-for="item in currentCategory.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{item.place}}</p>
              <p class="name ellipsis">{{item.name}}</p>
              <p class="desc ellipsis-2">{{item.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { findBrand } from '@/api/home.js'
export default {
  name: 'HomeCategory',
  setup () {
    // 左侧分类底部添加一个品牌
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      // 品牌数据
      brands: []
    })
    const store = useStore()
    const list = computed(() => {
      // 获取原始的分类数据
      const cates = store.state.cate.list
      // 左侧二级分类仅仅需要两个
      const result = cates.map(item => {
        // 不可以修改原始的数据，这份数据是Vuex共享的
        return {
          id: item.id,
          name: item.name,
          // 数组的filter方法返回值是最新的数组，但是不会影响之前的数组
          // 获取数组的前两项数据
          children: item.children && item.children.filter((item, index) => index < 2),
          goods: item.goods
        }
      })
      // 最后添加一个品牌即可
      result.push(brand)
      return result
    })
    // 获取当前分类逻辑
    const categoryId = ref(null)
    // 更加当前的分类id计算右侧对应的数据
    const currentCategory = computed(() => {
      return list.value.find(item => {
        return item.id === categoryId.value
      })
    })
    // 调用接口获取品牌数据
    findBrand().then(ret => {
      // 添加筛选
      brand.brands = ret.result.filter((item, index) => {
        return index < 6
      })
    })
    return { list, categoryId, currentCategory }
  }
}
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
.xtx-skeleton {
    animation: fade 1s linear infinite alternate;
    }
  @keyframes fade {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
