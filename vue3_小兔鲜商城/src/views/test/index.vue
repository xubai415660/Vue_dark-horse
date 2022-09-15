<template>
    <div>
    <h2>测试组件</h2>
    <hr>
    <button @click="flag=!flag">点击</button>
  <Transition name='abc'>
    <div v-if='flag' class="box"></div>
  </Transition>
  <Transition name='hello'>
    <div>hello</div>
  </Transition>
    </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'MyTest',
  setup () {
    const flag = ref(true)
    return { flag }
  }
}
</script>
<style scoped lang="less">
.box {
  width: 100px;
  height: 100px;
  background: pink;
}
.abc-enter-to,
.abc-leave-from {
  opacity: 1;
  width: 100px;
  height: 100px;
}

.abc-enter-active,
.abc-leave-active {
  transition: all 1s;
}

.abc-enter-from,
.abc-leave-to {
  opacity: 0;
  width: 0px;
  height: 0px;
}
</style>
