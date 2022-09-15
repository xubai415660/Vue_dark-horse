<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <Transition name='fade-right' mode='out-in'>
      <XtxBreadItem :key='info.top.id' v-if='info.top' :to='"/category/" + info.top.id'>{{info.top.name}}</XtxBreadItem>
    </Transition>
    <Transition name='fade-right' mode='out-in'>
      <XtxBreadItem :key='info.sub.id' v-if='info.sub'>{{info.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'SubBread',
  setup () {
    // 需要根据当前的二级分类id找到二级分类的名称和所属的一级分类的名称
    const store = useStore()
    const route = useRoute()
    const info = computed(() => {
      // cateInfo = { top: {id: 123, name: '电器}, sub: {id: 456, name: '电视'}}
      const cateInfo = {}
      // 数组的some方法也可以遍历数组，好处是可以终止遍历
      // forEach无法终止遍历，用some替代forEach
      store.state.cate.list.some(firstCate => {
        // 获取一级分类的下面的所有二级分类,并且根据当前二级分类的id查询二级分类的名称
        const secondCate = firstCate.children.find(item => {
          return item.id === route.params.id
        })
        if (secondCate) {
          // 获取二级分类的名称
          cateInfo.sub = { id: secondCate.id, name: secondCate.name }
          // 获取此时的一级分类的名称
          cateInfo.top = { id: firstCate.id, name: firstCate.name }
          // 找到我们需要的数据了，此时需要终止继续遍历
          return true
        }
      })
      return cateInfo
    })
    return { info }
  }
}
</script>
<style scoped lang="less">
.fade-right-enter-from,
.fade-right-leave-to {
  transform: none;
  opacity: 1;
}

.fade-right-enter-active {
  transition: all 0.5s;
}

.fade-right-enter-to,
.fade-right-leave-from {
  transform: translateX(40px);
  opacity: 0;
}
</style>
