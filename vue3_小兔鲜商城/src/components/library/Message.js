// 封装一个函数，实现组件的提示效果
// Message({type: 'success', text: '登录失败'})
// this.$message({type: 'success', text: '登录失败'})
import { createVNode, render } from 'vue'

// 如下的函数应该实现什么功能？渲染一个提示组件 XtxMessage
import XtxMessage from './xtx-message.vue'
// XtxMessage组件应该出现在哪里？全局的位置 document

// 动态创建一个div，然后添加到页面的body里面，用于放置提示组件
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

export default ({ type = 'success', text = 'error' }) => {
  // 这里需要把XtxMessage组件填充到上述的div当中
  // createVNode用于将组件渲染为虚拟节点
  // 参数一表示导入的组件
  // 参数二表示传递给组件的props属性
  const vnode = createVNode(XtxMessage, { type, text })
  // 需要把vnode填充到div里面
  // Vue2中render函数是选项，用来生成组件的模板
  // Vue3中render函数是导入的
  render(vnode, div)
  // 3秒后把XtxMessage组件进行隐藏(其实就是把div中组件销毁)
  setTimeout(() => {
    // 清空div里面的内容
    render(null, div)
  }, 3000)
}
