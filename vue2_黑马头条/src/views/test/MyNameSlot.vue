<template>
  <div>
    <!-- 给slot标签起一个名称，就是所谓的具名插槽 -->
    <div class="my-header">
      <slot name="header"></slot>
    </div>
    <div class="my-content">
      <!-- 默认插槽，只能有一个 -->
      <!-- 默认插槽的名称是default -->
      <slot name="default"></slot>
    </div>
    <div class="my-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<style scoped>
.my-header {
  color: red;
}
.my-content {
  color: blue;
}
.my-footer {
  color: orange;
}
</style>
