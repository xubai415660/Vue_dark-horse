<template>
  <van-action-sheet @open='handleOpen' :value="value" @input="handleClose($event)" title="编辑频道">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item, index) in channels" :key="item.id">
          <!-- 通过点击enterChannel事件 跳转到对应的频道当中 -->
          <span class="f12" @click='enterChannel(index)'
           :class='{red: index === activeIndex}'>{{item.name}}</span>
          <van-icon @click='handleDelete(item.id)'
           v-show="editing && index!==0" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" @click='addChannel(item)' name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>
<script>
import { getChannels, delChannel, addChannel } from '@/api/channel.js'

export default {
  props: {
    // 控制弹窗组件的显示
    value: {
      type: Boolean,
      // 默认值为false(父组件可以不传递数据)
      default: false
    },
    // 我的频道数据
    channels: {
      type: Array,
      // required: true
      // 表示数组的默认值是空数组[]
      default: () => []
    },
    // 当前频道的索引
    activeIndex: {
      type: Number,
      // required: true
      default: 0
    }
  },
  computed: {
    // 计算可选频道的数据
    optionChannels () {
      // 已知所有频道数据
      // 当前我的频道数据
      return this.allChannels.filter((item) => {
        // 过滤的条件：item不在我的频道数据中
        // arr.some方法作用：判断数组中是否包含符合条件的数据，只要有一项符合，就返回true
        return !this.channels.some((channel) => {
          // 让item和我的频道中每一项数据相比
          return channel.id === item.id
        })
      })
    }
    // ---------------------------------------------------------------------------
    // optionChannels () {
    //   // 已知所有频道数据
    //   // 当前我的频道数据
    //   const arr = this.allChannels.filter((item) => {
    //     // 过滤的条件：item不在我的频道数据中
    //     // arr.some方法作用：判断数组中是否包含符合条件的数据，只要有一项符合，就返回true
    //     const ret = this.channels.some((channel) => {
    //       // 让item和我的频道中每一项数据相比
    //       return channel.id === item.id
    //     })
    //     return !ret
    //   })
    //   return arr
    // }
  },
  data () {
    return {
      // 控制按钮的编辑状态
      editing: false,
      // 所有频道数据
      allChannels: []
    }
  },
  methods: {
    // 添加频道
    addChannel (channel) {
      // 准备参数：对每一个频道就行排序（添加seq属性就行编号：去掉【推荐频道】）
      // 先对之前的频道就行排序
      const orderChannels = this.channels.map((item, index) => {
        return {
          id: item.id, name: item.name, seq: index
        }
      })
      // 添加新的频道
      orderChannels.push({ id: channel.id, name: channel.name, seq: orderChannels.length })
      // 删除推荐
      orderChannels.splice(0, 1)
      // console.log(orderChannels)
      // 调用接口实现添加频道
      try {
        // 调用接口成功
        addChannel(orderChannels)
        // 添加频道成功后,添加页码的频道
        const newChannel = {
          // 频道的id
          id: channel.id,
          // 频道的标签名称
          name: channel.name,
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
        // 把新的频道数据传递给父组件,让父组件去添加
        this.$emit('add-channel', newChannel)
      } catch {
        this.$toast.fail('添加我的频道失败！')
      }
    },
    // 删除频道
    async handleDelete (id) {
      try {
        await delChannel(id)
        this.$emit('del-channel', id)
      } catch {
        this.$toast('删除频道失败')
      }
    },
    // 控制进入频道
    enterChannel (index) {
      // index表示当前单机的频道的索引
      // 这里需要把index传递给父组件并且给active赋值
      this.$emit('update:activeIndex', index)
      // 关闭弹窗
      this.$emit('input', false)
    },
    // 弹窗打开时触发
    async handleOpen () {
      // 调用接口获取所有的频道数据
      try {
        const ret = await getChannels()
        this.allChannels = ret.data.channels
      } catch (e) {
        console.log(e)
        this.$toast('获取所有频道失败')
      }
    },
    // 关闭弹窗
    handleClose (flag) {
      this.$emit('input', flag)
    }
  }
}
</script>
<style scoped lang='less'>
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
