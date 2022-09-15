<template>
  <div>
    <h1>子组件命名插槽内容</h1>
    <hr />
    <MyButton>
      你真棒！
      <template #s>
        <div>加载----内容</div>
      </template>
    </MyButton>
    <MyNameSlot>
      <!-- v-slot:插槽名称 -->
      <!-- v-slot指令需要用到template标签上 -->
      <!-- template标签最终不会渲染出来，仅仅是临时包裹 -->
      <template #header>
        <div>头部内容</div>
      </template>
      <template v-slot:default>
        <div>中间内容</div>
      </template>
      <template v-slot:footer>
        <div>底部内容</div>
      </template>
    </MyNameSlot>
  </div>
</template>
<script>
import MyButton from '@/views/test/MySlot.vue'
import MyNameSlot from '@/views/test/MyNameSlot.vue'

export default {
  name: 'TestSlot',
  components: {
    MyButton,
    MyNameSlot
  }
}
</script>
