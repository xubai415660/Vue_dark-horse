<template>
  <div>
    <h2>Jerry组件:{{ receiveMsg }}</h2>
    <button @click="handleClick">Jerry回应</button>
  </div>
</template>
<script>
export default {
  name: 'ChildB',
  data () {
    return {
      msg: 'hello',
      receiveMsg: ''
    }
  },
  methods: {
    handleClick () {
      this.eventBus.$emit('msg-abc', this.msg)
    }
  },
  created () {
    // 订阅Tom发送的消息
    this.eventBus.$on('msg-send', param => {
      this.receiveMsg = this.receiveMsg + '-----' + param
    })
  }
}
</script>
