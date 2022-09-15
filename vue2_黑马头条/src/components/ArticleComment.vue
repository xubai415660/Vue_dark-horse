<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load='onLoad'>
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in list" :key="comment.com_id.toString()">
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate|formatTime}}</span>&nbsp;
            <van-tag plain @click="showReply=true">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <span @click='sendComment' class="submit" slot="button">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { getComments, comment } from '@/api/article.js'

export default {
  name: 'ArticleComment',
  props: {
    // 文章的id
    articleId: { type: String, required: true }
  },
  data () {
    return {
      // 评论内容
      value: '',
      //   ；评论单次加载的状态
      loading: false,
      //   加载完成的标志
      finished: false,
      //   分页参数（下一页数据的开始位置）
      offset: null,
      // 评论列表
      list: []
    }
  },
  methods: {
    async sendComment () {
      // 发表评论
      try {
        await comment({ target: this.articleId, content: this.value })
        this.list = []
        this.offset = null
        this.onLoad()
        this.value = ''
      } catch {
        this.$toast('评论文章失败')
      }
      this.$toast('评论文章成功')
    },
    async onLoad () {
      // 调用接口获取评论数据
      const ret = await getComments(this.articleId, this.offset)
      this.list.push(...ret.data.results)
      // 修改本次加载的状态位
      this.loading = false
      // 判断结束的条件
      if (ret.data.last_id === ret.data.end_id) {
        // 列表数据已经全部加载完成
        this.finished = true
      } else {
        // 记录查询下一页数据开始的位置
        this.offset = ret.data.last_id
      }
    }
  }
}
</script>
<style scoped lang="less">
.comment {
  margin-top: 20px;
  /deep/ .item {
    display: flex;
    padding: 20px 0;
    .info {
      flex: 1;
      padding-left: 20px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 4px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 10px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 24px;
    color: #3296fa;
  }
}
</style>
