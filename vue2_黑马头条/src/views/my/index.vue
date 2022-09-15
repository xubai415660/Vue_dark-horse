<template>
  <div class="user">
    <div class="user-profile">
      <div class="info">
        <van-image round :src="info.photo" />
        <h3 class="name">
          {{info.name}}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{ info.art_count }}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{ info.follow_count }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{ info.fans_count }}</p>
          <p>粉丝</p>
        </van-col>
        <!-- <van-col span="6">
          <p>{{info.like_count}}</p>
          <p>被赞</p>
        </van-col> -->
      </van-row>
    </div>
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af" />我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00" />我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0" />阅读历史
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell @click='logout()' icon="warning-o" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/my.js'

export default {
  name: 'My',
  data () { return { info: {} } },
  methods: {
    logout () {
      // 退出功能
      this.$dialog.confirm({
        title: '退出',
        essage: '真的得退出吗😭'
      }).then(() => {
        // 实现退出功能：删除token,跳转到登录页面
        sessionStorage.removeItem('mytoken')
        this.$router.push('/login')
        this.$toast.success('确认退出')
      }).catch(() => {
        // 点击取消触发
        this.$toast.fail('取消退出')
      })
    },
    // 调用接口获取用户的信息
    async getUserInfo () {
      const ret = await getUserInfo()
      this.info = ret.data
    }
  },
  created () {
    this.getUserInfo()
  }

}
</script>
<style scoped lang="less">
.user {
  &-profile {
    width: 100%;
    height: 300px;
    display: block;
    background: #3296fa;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image {
        width: 128px;
        height: 128px;
      }
      .name {
        font-size: 32px;
        font-weight: normal;
        margin-left: 20px;
      }
      .van-tag {
        background: #fff;
        color: #3296fa;
      }
    }
    p {
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 30px;
  }
  &-links {
    padding: 30px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 48px;
      padding-bottom: 10px;
    }
  }
}
</style>
