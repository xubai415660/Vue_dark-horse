<template>
  <div class="main">
    <van-tabs swipeable v-model="active">
      <van-tab :key="item.id" v-for="item in channels" :title="item.name">
        <div class="scroll-wrapper">
          <!-- <van-cell v-for="item in 20" :key="item">{{index + '-' + item}}</van-cell> -->
          <van-pull-refresh v-model="activeChannel.isLoading" @refresh="onRefresh" :success-text="activeChannel.pullText">
            <van-list v-model="activeChannel.loading" :finished="activeChannel.finished" finished-text="没有更多了" @load="onLoad">
             <van-cell :to='{path: "/detail", query: {id: item.art_id.toString()}}' v-for="item in activeChannel.articles" :key="item.art_id.toString()">
                <!-- 三张图片布局 -->
                <div class="article_item">
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box">
                    <van-image lazy-load :class='[{w33: item.cover.type === 3}, {w100: item.cover.type === 1}]' :key='index' v-for='(img, index) in item.cover.images' fit="cover" :src="img" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}} 评论</span>
                    <span>{{item.pubdate|formatTime}}</span>
                    <span class="close">
                      <!-- 加入.stop阻止事件 -->
                      <van-icon @click.stop='handleOpen(item.art_id.toString())' name="cross"></van-icon>
                    </span>
                  </div>
                </div>
                <!-- 一张图片的布局 -->
                <!-- <div class="article_item">
                  <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
                  <div class="img_box">
                    <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                  </div>
                  <div class="info_box">
                    <span>你像一阵风</span>
                    <span>8评论</span>
                    <span>10分钟前</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div> -->
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon @click="handleEdit" name="wap-nav"></van-icon>
    </span>
    <!-- 添加更多操作组件 -->
    <!-- <more-action :value='isShow' @event-close='handleClose'></more-action> -->
    <!-- <more-action :value='isShow' @input='handleClose'></more-action> -->
    <!-- $event 在原生DOM事件中指的是事件对象 -->
    <!-- $event 在自定义事件中指的是传递的数据 -->
    <more-action v-model='isShow' :article-id='articleId' @on-success='handleDislike'></more-action>
    <!-- --------------------------------------------- -->
    <!-- <input type="text" v-model='uname'> -->
    <!-- $event 在原生DOM时间中指的是事件对象 -->
    <!-- <input type="text" :value='uname' @input='uname=$event.target.value'> -->

    <!-- 编辑频道组件 -->
    <!-- <channel-edit v-model='isEdit' :channels='channels' :activeIndex='active' @update-index='active=$event'> -->
    <channel-edit @add-channel='addChannel' @del-channel='delChannel'
    v-model='isEdit' :channels='channels' :activeIndex.sync='active'>
    </channel-edit>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel.js'
import { getArticles } from '@/api/article.js'
// 导入组件
import MoreAction from '@/components/MoreAction.vue'
import ChannelEdit from '@/components/ChannelEdit.vue'

export default {
  name: 'Main',
  // 配置组件
  components: {
    MoreAction,
    ChannelEdit
  },
  // 配置组件
  data () {
    return {
      // 控制Tab当前的选中的条目
      active: 0,
      // 列表数据加载过程的状态位
      loading: false,
      // 列表加载完成的标志
      finished: false,
      // 列表数据
      list: [],
      // 下拉刷新状态位
      isLoading: false,
      // 下拉刷新的提示信息
      pullText: '刷新成功🚀🚀🚀',
      // 函数节流标志位
      throttleFlag: false,
      // 频道数据
      channels: [],
      // 控制更多操作弹窗显示状态位
      isShow: false,
      // 记录当前操作文章的id
      articleId: '',
      // 控制编辑频道弹窗的显示和隐藏
      isEdit: false
    }
  },
  computed: {
    // 当前激活的频道（data中添加active索引数据）
    activeChannel () {
      return this.channels[this.active]
    }
  },
  methods: {
    // 添加频道
    addChannel (channel) {
      this.channels.push(channel)
    },

    // -----------------------删除频道--------------------------------
    delChannel (id) {
      // 根据id删除对应的频道
      const index = this.channels.findIndex(item => {
        return item.id === id
      })
      this.channels.splice(index, 1)
    },
    // ----------------控制打开编辑频道---------------------
    handleEdit () {
      this.isEdit = true
    },
    // ------------------不感兴趣操作成功-------------------------
    handleDislike (id) {
      // 根据id删除该文章
      const index = this.activeChannel.articles.findIndex(item => {
        return item.art_id.toString() === id
      })
      // 根据索引删除数组的一个元素
      this.activeChannel.articles.splice(index, 1)
    },
    // --------------控制更多操作弹窗的关闭-------------------------
    handleClose (flag) {
      this.isShow = flag
    },
    // ---------------控制更多操作组件显示-----------------------
    handleOpen (id) {
      // 控制弹窗显示
      this.isShow = true
      // 记录文章的id
      this.articleId = id
    },
    // methods中定义方法，获取文章的分页数据
    async getArticles () {
      // -----------------获取当前频道------------------------
      const channel = this.activeChannel
      console.log(channel)

      // const ret = awaitgetArticles(channel.id, channel.timestamp)
      const ret = getArticles(channel.id, '1556789000001')
      console.log(ret)
    },
    // --------------------------获取用户的频道数据---------------------
    async getAllChannels () {
      const ret = await getAllChannels()
      // channels = [{id: 1, name: 'java}, {id: 2, name: 'python'}]
      this.channels = ret.data.channels.map(item => {
        return {
          // 频道的id
          id: item.id,
          // 频道的标签名称
          name: item.name,
          // 文章列表加载状态
          loading: false,
          // 下拉刷新的完成状态
          isLoading: false,
          // 上拉列表加载完成的标志
          finished: false,
          // 下拉刷新完成的提示信息
          pullText: '加载成功',
          // 时间戳，用于实现列表的分页查询
          timestamp: +new Date(),
          // 文章列表
          articles: []
        }
      })
    },
    // -------------------下拉时触发，加载最新的数据即可--------------------------
    async onRefresh () {
      // 对接真实的数据（重新调用接口覆盖当前数据）
      // 获取当前频道信息
      const channel = this.activeChannel
      // 重置时间戳
      channel.timestamp = +new Date()
      // 根据频道提供的参数，调用接口获取文章列表数据
      const ret = await getArticles(channel.id, channel.timestamp)
      // 需要把加载的最新的数据覆盖文章列表
      if (ret.data.results.length > 0) {
        channel.articles = ret.data.results
        if (ret.data.pre_timestamp) {
          channel.timestamp = ret.data.pre_timestamp
        }
      } else {
        channel.pullText = '没有数据要更新😥...'
        channel.articles = []
        channel.timestamp = ret.data.pre_timestamp
        this.onLoad()
      }
      // 判断是否有时间戳
      // if (ret.data.pre_timestamp) {
      //   channel.timestamp = ret.data.pre_timestamp
      // }
      // 更新刷新成功的标志位
      channel.isLoading = false
      // 加载完成的标志需要重置
      channel.finished = false

      // -------------------------------------------------------------
      /*  setTimeout(() => {
        const data = [1, 2, 3, 4, 5]
        if (data.length > 0) {
          // 有新的数据(先请空之前的数据，再放入最新的数据)
          this.list = []
          this.list.push(...data)
        } else {
          // 没有新的数据
          this.pullText = '没有数据需要更新😥...'
        }
        // 把列表加载结束的标志重置一下
        this.finished = false
        // 手动加载下一页（防止不够一页数据 ）
        this.onLoad()
        // 通知下拉刷新的组件成功了
        this.isLoading = false
      }, 1000) */
    },

    // 每次触发动态加载一页新的数据（上滑到底部时触发）
    // 函数节流：在固定的时间内（1秒），无论触发多少次条件（onLoad触发一次），仅仅执行一次任务（加载一页数据）
    async onLoad () {
      // ------------------真实场景---------------------------------
      // 获取当前频道信息
      const channel = this.activeChannel
      // 根据频道提供的参数，调用接口获取文章列表数据
      const ret = await getArticles(channel.id, channel.timestamp)
      // 把加载的单页数据添加到文章列表的数组中
      channel.articles.push(...ret.data.results)
      // 通知vant-list组件数据本次加载成功了
      channel.loading = false
      // 判断列表是否全部数据加载完成
      if (ret.data.pre_timestamp) {
        // 还有更多数据可以加载
        channel.timestamp = ret.data.pre_timestamp
      } else {
        // 此次加载后就没有更多数据了
        channel.finished = true
      }

      // --------------------------------------------------
      /* if (this.throttleFlag) return (this.throttleFlag = true)
      // --------------模拟异步操作--------------------------------
      window.setTimeout(() => {
        // 加载一页新的数据
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 告诉列表组件本次数据已经完成加载
        this.loading = false
        // 判断数据加载完成,如果加载完成后，需要告诉list组件
        if (this.list.length >= 50) {
          // 加载结束
          this.finished = true
        }
        // 允许加载下一次数据
        this.throttleFlag = false
      }, 1100) */
    }
  },
  // -------------------触发方法------------------------------------
  async created () {
    // 接口调用时异步的
    await this.getAllChannels()
    // this.getArticles()
    console.log(this.$abc)
  }
}
</script>

<style scoped lang="less">
// 如果希望覆盖第三方组件提供类名，需要添加/deep/
.main {
  height: 100%;
  .van-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .van-tabs__wrap {
      height: 72px;
      padding-right: 72px;
      .van-tab {
        line-height: 72px;
      }
      .van-tabs__line {
        background-color: #3296fa;
        height: 2px;
      }
    }
    /deep/ .van-tabs__content {
      flex: 1;
      overflow: hidden;
      .van-tab__pane {
        height: 100%;
        .scroll-wrapper {
          height: 100%;
          overflow-y: auto;
        }
      }
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
          height: 180px;
        }
        .w100 {
          width: 100%;
          height: 360px;
        }
      }
      .info_box {
        color: #999;
        line-height: 2;
        position: relative;
        font-size: 24px;
        span {
          padding-right: 20px;
          &.close {
            border: 1px solid #ddd;
            border-radius: 4px;
            line-height: 30px;
            height: 24px;
            width: 32px;
            text-align: center;
            padding-right: 0;
            font-size: 16px;
            position: absolute;
            right: 0;
            top: 14px;
          }
        }
      }
    }
  }
  .bar_btn {
    width: 72px;
    height: 70px;
    position: absolute;
    top: 0;
    right: 0;
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 999;
      box-shadow: 0 0 10px #999;
      transform: scale(1, 0.6);
    }
    .van-icon-wap-nav {
      width: 100%;
      height: 100%;
      background: #fff;
      text-align: center;
      line-height: 70px;
      position: relative;
      z-index: 1000;
      &::before {
        font-size: 40px;
      }
    }
  }
}
</style>
