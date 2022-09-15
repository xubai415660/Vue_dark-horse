<template>
  <div>
    <div class="tab">
      <button @click="handleChange(0)" :class="{ active: currentIndex === 0 }">
        apple
      </button>
      <button @click="handleChange(1)" :class="{ active: currentIndex === 1 }">
        orange
      </button>
      <button @click="handleChange(2)" :class="{ active: currentIndex === 2 }">
        peach
      </button>
      <div :class="{ active: currentIndex === 0 }">苹果</div>
      <div :class="{ active: currentIndex === 1 }">橘子</div>
      <div :class="{ active: currentIndex === 2 }">桃子</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CacheA',
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    handleChange (index) {
      // 控制选项卡切换
      this.currentIndex = index
    }
  },
  created () {
    console.log('----------------')
  },
  activated () {
    // 被缓存的组件重新显示时触发
    console.log('===========')
    this.currentIndex = 0
  },
  deactivated () {
    // 隐藏被缓存的组件时触发
    console.log('---222-------')
  }

}
</script>
<style scoped lang="less">
.tab {
  button.active {
    background-color: orangered;
  }
  div {
    &.active {
      display: block;
    }
    display: none;
    height: 300px;
    background-color: yellow;
  }
}
</style>
