<template>
<div class="container">
    <!-- 导航固定定位 fixed -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load='onLoad'>
      <van-cell-group>
        <!-- <van-cell @click="$router.push('/detail?id='+item.art_id.toString())" v-for='item in list' :key='item.art_id.toString()'> -->
        <!-- van-cell组件支持路由跳转，类似于router-link标签的to属性 -->
        <van-cell :to='{path: "/detail", query: {id: item.art_id.toString()}}' v-for='item in list' :key='item.art_id.toString()'>
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box">
              <van-image :key='index'
              v-for='(img, index) in item.cover.images'
              fit="cover" :src="img"
              :class="[{w33: item.cover.type===3}, {w100: item.cover.type===1}]"  />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate|formatTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>
<script>
import { searchArticles } from '@/api/search.js'
export default {
  name: 'Sresult',
  data () {
    return {
      // 单次加载状态
      loading: false,
      // 列表是否完全加载完成的标志
      finished: false,
      // 请求参数
      queryData: {
        // 当前页码
        pagenum: 1,
        // 每页的条数
        // pagesize: 10,
        pagsieze: 10,
        // 查询关键字
        kw: ''
      },
      // 匹配的列表数据
      list: [],
      // 列表的总数
      total: 0
    }
  },
  methods: {
    async onLoad () {
      // 页面加载时，触发一次，如果不够一屏，再次调用一次
      const ret = await searchArticles(this.queryData)
      this.list.push(...ret.data.results)
      this.total = ret.data.total_count
      // 结束这次的加载
      this.loading = false
      // 判断加载完成的状态
      if (this.list.length >= this.total) {
        // 没有更多数据需要加载
        this.finished = true
      } else {
        // 还有更多数据可以加载：页码累加
        this.queryData.pagenum += 1
      }
    }
  },
  created () {
    // 获取路由参数中的查询关键字
    this.queryData.kw = this.$route.query.kw
  }
}
</script>
<style scoped lang="less">
.container {
  padding-top: 92px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 200px;
    }
    .w100 {
      height: 360px;
      width: 100%;
    }
  }
  .info_box {
    color: #199cc0;
    line-height: 2;
    position: relative;
    span {
      padding-right: 20px;
    }
  }
}
</style>
