<template>
  <div>
    <button>
      <!-- 如下的标签就是插槽，用于填充，父组件传递过来的内容：标签之间的内容 -->
      <!-- 本质上，依然是父组件向子组件传递信息 -->
      <!-- slot标签中间的内容表示默认值：父组件如果没有传递插槽内容，显示默认值 -->
      <slot>点击</slot>
    </button>
    <div class="my-s">
      <slot name="s"></slot>
    </div>
  </div>
</template>
<style scoped>
.my-s {
  color: red;
  background-color: blue;
}
</style>
