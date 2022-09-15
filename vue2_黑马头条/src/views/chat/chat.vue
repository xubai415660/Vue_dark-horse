<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list">
      <!-- <div class="chat-item left">
        <van-image fit="cover" round :src="xzAvatar" />
        <div class="chat-pao">ewqewq</div>
      </div>
      <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image fit="cover" round :src="photo" />
      </div> -->
      <div class="chat-item" :class='[{left: item.name==="xz"}, {right: item.name === name}]' v-for='(item,index) in list' :key='index'>
        <van-image fit="cover" v-if='item.name==="xz"' round :src="xzAvatar" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image fit="cover" v-if='item.name===name' round :src="photo" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <span @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>
<script>
// 脚手架环境可以直接以模块化方式导入图片
import xz from '@/assets/xz.png'
import { io } from 'socket.io-client'
// websocket的基本使用
// 1、安装依赖包 npm i socket.io-client
// 2；导入包 import { io } from 'socket.io-client'
// 3、基于id对象提供的api实现双向通信

export default {
  name: 'Chat',
  data () {
    return {
      // 小智头像
      xzAvatar: xz,
      // 登录用户的头像
      photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
      // 登录的用户名称
      name: 'python',
      // 说的内容
      value: '',
      // 聊天记录
      list: [],
      // socket实例对象
      ws: null
    }
  },
  methods: {
    // 初始化Socket链接
    initConnection () {
      // 初始化链接配置
      this.ws = io('ws://localhost:3000/')
      // 监听链接成功的动作
      this.ws.on('connect', () => {
        // 链接成功后，向服务器发送一条消息
        // 1、把消息添加到页面
        const info = {
          name: this.name,
          msg: '你好'
        }
        this.list.push(info)
        // 2、把消息发送给后端
        this.ws.emit('chat message', info)
      })
      // 监听服务器返回的消息
      this.ws.on('chat message', (info) => {
        this.list.push({
          name: 'xz',
          msg: info.msg
        })
      })
    },
    // 向服务器发送消息
    send () {
      // 1、把消息内容添加到页面列表中
      const info = {
        name: this.name,
        msg: this.value
      }
      this.list.push(info)
      // 2、把消息发送给服务器
      this.ws.emit('chat message', info)
      // 清空表单
      this.value = ''
    }
  },
  created () {
    this.initConnection()
  },
  destroyed () {
    // 释放socket链接资源（告诉服务器断开连接）
    this.ws.close()
  }
}
</script>
<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 20px;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 70%;
        min-height: 80px;
        line-height: 76px;
        border: 0.5px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
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
}
</style>
