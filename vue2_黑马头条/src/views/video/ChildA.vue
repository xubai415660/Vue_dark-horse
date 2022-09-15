<template>
  <div>
    <h2>Tom组件:{{ receiveMsg }}</h2>
    <button @click="handleClick">Tom发送</button>
  </div>
</template>
<script>
export default {
  name: 'ChildA',
  data () {
    return {
      msg: 'nihao😂😫🐷',
      receiveMsg: ''
    }
  },
  methods: {
    handleClick () {
      // console.log(this.eventBus)
      // 把data中的msg消息发送给Jerry组件
      this.eventBus.$emit('msg-send', this.msg)
    }
  },
  created () {
    this.eventBus.$on('msg-abc', param => {
      this.receiveMsg = param
    })
  }
}
</script>
