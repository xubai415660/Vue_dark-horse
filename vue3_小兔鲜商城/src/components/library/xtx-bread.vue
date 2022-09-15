<script>
// import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // vue2的render函数的形参是 h 函数
    // vue3中h函数是导入的
    // createElement(标签名称, 标签的属性, 标签的子元素)
    // console.dir(this.$slots.default())
    // 获取XtxBread组件的所有的插槽里面填充组件实例
    const items = this.$slots.default()
    const results = []
    items.forEach((item, index) => {
      results.push(item)
      // 手动生成一个i图标，添加到面包屑项目的后面
      // const iTag = h('i', { class: 'iconfont icon-angle-right' })
      if (index < items.length - 1) {
        // results.push(iTag)
        results.push(<i class="iconfont icon-angle-right"></i>)
      }
    })
    // div的子节点应该动态生成：更加插槽的内容动态生成
    // return h('div', { class: 'xtx-bread' }, results)
    return <div class="xtx-bread">{results}</div>
  }
}
</script>

<style lang="less">
// scoped的作用，就是让这里定义的类名在当前组件模板中有效
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式的方法，不合理
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>
