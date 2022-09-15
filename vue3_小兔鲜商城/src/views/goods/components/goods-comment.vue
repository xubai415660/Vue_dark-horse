<template>
  <div class="goods-comment">
    <div class="head" v-if='commentInfo'>
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;" :class='{active: currentIndex === i}' v-for='(item, i) in commentInfo.tags' :key='i' @click='changeTag(i)'>{{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" :class="{active: reqParams.sortField === null}" @click='changeSort(null)'>默认</a>
      <a href="javascript:;" :class="{active: reqParams.sortField === 'createTime'}" @click='changeSort("createTime")'>最新</a>
      <a href="javascript:;" :class="{active: reqParams.sortField === 'praiseCount'}" @click='changeSort("praiseCount")'>最热</a>
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for='item in list.items' :key='item.id'>
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01" v-for='star in item.score' :key='star'></i>
            <i class="iconfont icon-wjx02" v-for='star in 5 - item.score' :key='star'></i>
            <span class="attr">{{formatAttr(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 图片预览组件 -->
          <GoodsCommentImage v-if='item.pictures.length' :pictures='item.pictures' />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <!-- total表示总条数据 -->
    <!-- pagesize表示每页条数 -->
    <!-- current-page表示当前页码 -->
    <XtxPagination :page='2' :total='total' :pagesize='10' @change-page='changePage' />
  </div>
</template>
<script>
import { ref, inject, reactive, watch } from 'vue'
import { findCommentInfoByGoods, findCommentListByGoods } from '@/api/product.js'
import GoodsCommentImage from './goods-comment-image.vue'

// const useCommentList = (id, params, list) => {
//   // const list = ref([])
//   findCommentListByGoods(id, params).then(data => {
//     list.value = data.result
//   })
// }

export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    // 商品详情数据
    const goods = inject('goods')
    // 评论列表筛选条件
    const reqParams = reactive({
      // 当前页码
      page: 1,
      // 每页条数
      pageSize: 10,
      // 是否有图片
      hasPicture: null,
      // 筛选标签
      tag: null,
      // 排序字段
      sortField: null
    })
    // 评论列表的总数
    const total = ref(0)
    // 获取评论的列表数据
    // let list = useCommentList(goods.value.id, reqParams)
    // 当前选中的标签的索引
    const currentIndex = ref(0)
    // 评论配置信息
    const commentInfo = ref(null)
    // 获取评论的配置信息
    findCommentInfoByGoods(goods.value.id).then(data => {
      // 手动添加两个选项
      data.result.tags.unshift({
        title: '有图',
        tagCount: data.result.hasPictureCount,
        type: 'img'
      })
      data.result.tags.unshift({
        title: '全部评价',
        tagCount: data.result.evaluateCount,
        type: 'all'
      })
      commentInfo.value = data.result
    })
    // 切换排序标签
    const changeSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }
    // 控制标签的切换
    const changeTag = (i) => {
      // 选中索引
      currentIndex.value = i
      // 获取标签数据对象
      const tag = commentInfo.value.tags[i]
      if (tag.type === 'all') {
        // 全部评价
        reqParams.hasPicture = null
        reqParams.tag = null
        reqParams.sortField = null
      } else if (tag.type === 'img') {
        // 是否有图
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        // 后续的四个标签
        reqParams.tag = tag.title
        reqParams.hasPicture = false
      }
      // 重置页码
      reqParams.page = 1
    }
    // 侦听排序和标签的参数变化
    const list = ref([])
    watch(reqParams, () => {
      // useCommentList(goods.value.id, reqParams, list)
      findCommentListByGoods(goods.id, reqParams).then(data => {
        list.value = data.result
        total.value = data.result.counts
      })
    }, {
      immediate: true
    })
    // 格式化属性信息
    const formatAttr = (specs) => {
      return specs.reduce((ret, item) => `${ret} ${item.name}:${item.nameValue}`, '')
    }
    // 格式化昵称
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    // 监听页码的变化
    const changePage = (page) => {
      reqParams.page = page
    }

    return { total, changePage, commentInfo, currentIndex, list, reqParams, changeSort, changeTag, formatAttr, formatNickname }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
