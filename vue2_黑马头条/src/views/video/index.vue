<template>
  <div>
    <h2>测试非父子组件通信</h2>
    <hr />
    <child-a></child-a>
    <child-b></child-b>
  </div>
</template>

<script>
import ChildA from './ChildA.vue'
import ChildB from './ChildB.vue'
export default {
  name: 'Video',
  components: {
    ChildA,
    ChildB
  },
  data () {
    return {}
  },
  methods: {}
}
</script>
