import defaultImg from '@/assets/images/200.png'
import Message from './Message.js'
import Confirm from './Confirm.js'

// 参数一：从哪个目录中读取文件
// 参数二：是否读取子目录中的文件：true读取子目录，false不读取子目录
// 参数三：读取文件的匹配规则
const importFn = require.context('./', false, /\.vue$/)
// importFn.keys()返回值是数组，其中放的是组件的文件名称

// 自定义图片懒加载指令
const defineDirective = (app) => {
  app.directive('lazy', {
    // vue2中用 inserted   vue3用 mounted
    mounted (el, bindings) {
    // el表示绑定指令DOM
    // bindings表示指令的相关信息
    // 实现图片懒加载的监听
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 进入可视区后，取消监听
          observer.unobserve(el)
          // 进入可视区域：加载图片的地址
          el.src = bindings.value
          // 监听图片加载失败的情况
          el.onerror = () => {
            // 如果图片失败了，就显示默认图片
            el.scr = defaultImg
          }
        }
      }, {
        threshold: 0.01
      })
      // 实现图片DOM的监听
      observer.observe(el)
    }
  })
}
export default {
  install (app) {
    // ------------自动化批量注册全局组件------------------
    importFn.keys().forEach(componentPath => {
      // 导入组件
      const component = importFn(componentPath).default
      console.log(component.name)
      // 注册全局组局
      app.component(component.name, component)
    })
    // 调用方法定义指令
    defineDirective(app)

    // Vue2中直接向原型对象中添加属性即可
    // Vue.prototype.$message = Message
    // app.prototype.$message = Message
    // Vue3扩展原型属性，需要按照如下方式实现
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}
