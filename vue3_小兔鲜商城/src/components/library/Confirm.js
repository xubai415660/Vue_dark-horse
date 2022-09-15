import { createVNode, render } from 'vue'

import XtxConfirm from './xtx-confirm.vue'

// 动态创建一个div，然后添加到页面的body里面，用于放置提示组件
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  // title表示确认框的标题
  // text表示确认框提示的内容
  return new Promise((resolve, reject) => {
    // 点击确定的回调
    const submitCallback = () => {
      // 关闭销毁弹窗，触发resolve
      render(null, div)
      resolve()
    }
    // 点击取消的回调
    const cancelCallback = () => {
      // 关闭销毁弹窗，触发reject
      render(null, div)
      reject(new Error('cancel'))
    }
    const vnode = createVNode(XtxConfirm, {
      title,
      text,
      submitCallback,
      cancelCallback
    })
    render(vnode, div)
  })
}

// Confirm({ title: '确认消息', text: '确认要删除吗' }).then(() => {
//   // 点击确定
// }).catch(() => {
//   // 点击取消
// })
