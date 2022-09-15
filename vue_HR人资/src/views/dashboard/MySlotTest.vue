<template>
  <div>
    <h2>作用域插槽测试</h2>
    <div>姓名:{{ firstName+' '+lastName }}</div>
    <div>
      <slot :info="info" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MySlotTest',
  props: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  computed: {
    //   获取父组件传递过来的数据,包装成对象返回
    info () {
      return {
        fname: this.firstName,
        lname: this.lastName
      }
    }
  }
}
</script>
