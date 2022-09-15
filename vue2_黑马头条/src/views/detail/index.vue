<template>
  <div class='container' ref="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail" v-if="article">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|formatTime}}</p>
        </div>
         <van-button @click='toggleFocus' round size="small" type="info">
          {{article.is_followed?'已关注':'+ 关注'}}
        </van-button>
      </div>
      <!-- 文章内容 -->
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button @click="toggleStatus(1)" round size="small"
        :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button @click="toggleStatus(2)" round size="small"
        :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- 文章评论 -->
    <!-- article默认值为null，默认不渲染这个组件 -->
    <!-- 当查询到文章详情数据后再渲染列表 -->
    <article-comment v-if='article' :article-id='article.art_id.toString()'></article-comment>
  </div>
</template>
<script>
import { getDetailById, followArticle, unFollowArticle, likes, unlikes, dislikes, undislikes } from '@/api/article.js'
import ArticleComment from '@/components/ArticleComment.vue'

export default {
  name: 'Detail',
  components: { ArticleComment },
  data () { return { article: null } },
  methods: {
    // 实现点赞效果(4种操作：点赞和取消点赞，不喜欢和取消不喜欢)
    async toggleStatus (type) {
      // 判断点击的是第几个按钮？
      if (type === 1) {
        // 处理点赞和取消点赞（点击第一个按钮）
        if (this.article.attitude === 1) {
          // 取消点赞
          try {
            // 此时状态：已经点赞，点击后应该取消点赞
            await unlikes(this.article.art_id.toString())
            // 取消点赞按钮的红色样式
            this.article.attitude = -1
          } catch {
            this.$toast('取消点赞失败')
          }
        } else {
          // 点赞
          try {
            // 此时状态：未点赞，点击应该进行点赞
            await likes(this.article.art_id.toString())
            // 添加点赞按钮的红色样式
            this.article.attitude = 1
          } catch {
            this.$toast('点赞失败')
          }
          this.$toast.success('点赞成功')
        }
      } else {
        // 处理不喜欢和取消不喜欢（点击第二个按钮）
        if (this.article.attitude === 0) {
          // 取消不喜欢
          try {
            // 此时状态：不喜欢（红色），点击后取消【不喜欢】操作
            await undislikes(this.article.art_id.toString())
            // 去掉【不喜欢】按钮红色样式
            this.article.attitude = -1
          } catch {
            this.$toast('取消不喜欢失败')
          }
          this.$toast.success('取消不喜欢成功')
        } else {
          // 不喜欢
          try {
            // 此时状态：没有不喜欢（黑色），点击添加【不喜欢】操作
            await dislikes(this.article.art_id.toString())
            // 添加【不喜欢】按钮红色样式
            this.article.attitude = 0
          } catch {
            this.$toast('不喜欢失败')
          }
        }
      }
    },
    // 关注或者取消关注文章
    async toggleFocus () {
      // 判断关注和取消关注的操作
      if (this.article.is_followed) {
        // 已经关注了，此时需要取消关注
        try {
          await unFollowArticle(this.article.aut_id)
          // 如果上面调用接口失败了，那么下面的一行代码根本不会执行
          this.article.is_followed = !this.article.is_followed
        } catch {
          return this.$toast.fail('取消关注失败')
        }
        this.$toast.fail('取消关注😭')
      } else {
        // 尚未关注，此时需要进行关注
        try {
          await followArticle(this.article.aut_id)
          this.article.is_followed = !this.article.is_followed
        } catch {
          return this.$toast.fail('关注失败')
        }
        this.$toast.success('关注成功')
      }
    },
    //   获取文章详情数据
    async getDetailById () {
      const ret = await getDetailById(this.$route.query.id)
      this.article = ret.data
    }
  },
  created () {
    this.getDetailById()
  }
}
</script>
<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 92px 20px 88px;
  // height: 1000%;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 28px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 24px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
    /deep/ pre {
      white-space: pre-wrap;
    }
  }
}
</style>
