<template>
  <div>
    <h2>测试nextTick</h2>
    <hr />
    <input type="text" v-model="info" ref="myinfo" />
    <!-- <input type="text" ref='myinfo'> -->
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data () {
    return {
      info: 'hello',
      n: 0
    }
  },
  methods: {
    handleClick () {
    // console.log(this.info)
      // 我们不需要频繁修改这里的数据
      // this.info = 'nihao'
      // this.info = 'hi'
      // this.info = 'abc'

      // this.n += 1
      // this.n += 1
      // this.n += 1
      // console.log(this.n)
      // console.log(this.info)
      // 如下的操作DOM的方式，无法获取最新的更新后的数据
      // 数据的变化导致页面的更新是需要时间（异步的）
      // setTimeout(() => {
      //   console.log(this.$refs.myinfo.value)
      // }, 0)

      // this.$nextTick可以保证DOM完成数据更新后触发回调
      // this.$nextTick(() => {
      //   console.log(this.$refs.myinfo.value)
      // })

      // Vue.nextTick(() => {
      //   console.log(this.$refs.myinfo.value)
      // })
      this.info = 'nihao'
      this.$nextTick()
        .then(() => {
          console.log('==================' + this.$refs.myinfo.value)
          this.info = 'hi'
          // return this.$nextTick()
        })
        .then(() => {
          console.log('------------------' + this.$refs.myinfo.value)
        })
    }
  }
}
</script>
