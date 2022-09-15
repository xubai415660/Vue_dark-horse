<template>
  <!-- v-model是谁的语法糖？ :value='' @input='' -->
  <!-- <van-popup v-model='value'> -->
  <van-popup :value="value" @input="handleClose">
    <van-cell-group v-if="!isReport">
      <van-cell @click="dislike">不感兴趣</van-cell>
      <van-cell is-link @click="isReport = true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport = false">返回</van-cell>
      <van-cell icon="info-o" @click="handleReport(item.value)" v-for="item in reports"
      :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { dislike, report } from '@/api/article.js'
import { reports } from '@/utils/constant.js'

export default {
  name: 'MoreAction',
  // props: ['value'],
  props: {
    // 属性的类型检测:提高组件被使用时传递数据的规范性
    value: {
      // 属性值必须是布尔类型
      type: Boolean,
      // 属性是必填项
      required: true
    },
    // 操作的文章id
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    // 控制举报窗口
    return {
      isReport: false,
      reports: reports
    }
  },
  methods: {
    // 举报文章
    async handleReport (type) {
      try {
        const ret = await report(this.articleId, type)
        if (ret.data.target) {
          // 举报成功
          this.$toast('举报文章成功')
          // 关闭弹窗
          this.$emit('input', false)
          // 通知父组件删除文章
          this.$emit('on-success', this.articleId)
        }
      } catch {
        this.$toast('举报文章失败！')
      }
    },
    // 对文章不感兴趣
    async dislike () {
      // 告诉后端，我对这篇文章不感兴趣
      try {
        const ret = await dislike(this.articleId)
        if (ret.data.target) {
          this.$toast.success('不感兴趣操作成功😊')
          // 关闭弹窗
          this.$emit('input', false)
          // 删除对应的文章数据（通知父组件去删除文章数据）
          this.$emit('on-success', this.articleId)
        }
      } catch {
        this.$toast.fail('不感兴趣操作失败😑')
      }
    },
    handleClose () {
      // 控制关闭弹窗（只能让父组件去关闭）
      // this.$emit('event-close', false)
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped lang="less">
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
