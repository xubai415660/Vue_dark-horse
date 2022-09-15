<template>
  <div>
    <ul>
      <li v-for="(item,index) in data" :key="index">
        <!-- slot标签之前的内容是插槽的默认值 -->
        <slot :data="item">{{ item.name }}</slot>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'MyTreeTest',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>
