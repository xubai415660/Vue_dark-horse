<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ uname }}</div>
    <hr>
    <my-com />
    <svg-icon icon-class="form" />
    <!-- template标签用法 -->
    <hr>
    <div v-if="isShow">tom</div>
    <!-- 方便统一控制一组标签，而template标签本身不会渲染出来 -->
    <template v-if="isShow">
      <div>tom</div>
      <div>jerry</div>
    </template>
    <!-- --------动态路由测试--------------- -->
    <hr>
    <!-- 动态组件方便进行一类组件的缓存控制 -->
    <keep-alive>
      <!-- 动态组件: currentComponent的属性值是那个组件名称就显示那个组件-->
      <component :is="currentComponent" />
    </keep-alive>
    <hr>
    <button @click="currentComponent = 'my-info'">Info</button>
    <button @click="currentComponent = 'my-msg'">Msg</button>
    <!-- <my-msg /> -->
    <hr>
    <!-- 动态组件的is属性至此原生的DOM标签 -->
    <!-- component标签上可以通过属性绑定给动态组件或者HTML标签绑定属性 -->
    <component :is="currentComponent" :href="curl" :class="{active:true}">拼搏百天</component>
    <!-- vue在做属性绑定时，可以一次性通过一个对象绑定多个属性 -->
    <component :is="currentComponent" v-bind="obj">百度跳转</component>
    <hr>
    <my-slot-test first-name="tom" last-name="green">
      作用域插槽测试内容
    </my-slot-test>
    <my-slot-test first-name="四" last-name="李">
      <!-- 从组件中获取子组件的数据:数据来源是动态的绑定到slot标签上的属性-->
      <!-- 利用子组件传递过来的数据定制子组件的模板 -->
      <!-- 不修改子组件的代码,通过子组件提供的数据,动态修改子组件的模板 -->
      <template v-slot="item">
        <div>姓名:{{ item.info.lname+' '+item.info.fname }}</div>
        <!-- 子组件slot标签上绑定的属性名称 -->
        <div>作用域插槽测试内容2</div>
      </template>
    </my-slot-test>
    <!-- ------------------------------------------------------ -->
    <hr>
    <!-- 树形组测试 -->
    <my-tree-test :data="departs">
      <template v-slot="scope">
        <div>《{{ scope.data.name }}》</div>
      </template>
    </my-tree-test>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MyInfo from './MyInfo.vue'
import MyMsg from './MyMsg.vue'
import MySlotTest from './MySlotTest'
import MyTreeTest from './MyTreeTest'
export default {
  name: 'Dashboard',
  components: {
    MyInfo,
    MyMsg,
    MySlotTest,
    MyTreeTest
  },
  data () {
    return {
      departs: [
        { name: 'tom' },
        { name: 'jerry' },
        { name: '王浩' },
        { name: 'kitty' }
      ],
      isShow: true,
      currentComponent: 'a',
      curl: 'https://www.baidu.com',
      obj: {
        href: 'https://www.baidu.com',
        class: 'avtive'
      }
    }
  },
  computed: {
    ...mapGetters(['uname'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
