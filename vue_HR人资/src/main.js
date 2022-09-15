import Vue from 'vue'
// 屏蔽浏览器之间样式的差异
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 导入Element-UI相关的配置
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 用来实现国际化（多语言支持）
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// 导入全局自定义样式
import '@/styles/index.scss' // global css
// 导入根组件
import App from './App'
// 导入vuex配置
import store from './store'
// 导入路由
import router from './router'
// 导入字体图标
import '@/icons' // icon
// 导入权限配置
import '@/permission' // permission control
// 语言插件
import i18n from '@/lang'

// 配置ElementUI的中英切换逻辑
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 导入自定义插件
import MyPlugins from '@/utils/plugins.js'
// 配置插件
Vue.use(MyPlugins, { defaultImg: 'default.png' })
// 配置打印插件
import Print from 'vue-print-nb'
Vue.use(Print)

// set ElementUI lang to EN
// 配置ElementUI插件（支持选项配置-Vue插件的规则）
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 测试render函数用法
Vue.component('my-com', {
  data () {
    return {
      msg: 'nihao'
    }
  },
  // 脚手架的开发环境不支持字符串模板，但是本质上，template在运行阶段，会自动编译成render函数
  // render函数比template更加底层
  // template: '<div>{{msg}}</div>'
  // ---------------------------------------------
  // 组件的模板可以由render函数提供
  render (createElement) {
    // createElement的参数
    // 参数一，表示标签名称
    // 参数二，表示里面的内容子元素
    // return createElement('div', 'hello')
    // 如下的代码就是JSX（js代码中直接写标签）
    // return (
    //   <div>
    //     <div>hello</div>
    //     <div>nihao</div>
    //     <div>hi</div>
    //   </div>
    // )

    // js结合标签一块写（JSX）
    // Vue 的render函数支持React的JSX语法规则
    const arr = []
    arr.push(<div>hello</div>)
    arr.push(<div>nihao</div>)
    // 在JSX中插值表达式用的单的花括号
    // 组件必须有唯一的根节点
    // 虚拟DOM节点的本质是对真实DOM节点的描述
    // 其实就是用对象的方式描述真实的DOM节点（虚拟DOM其实就是对象）
    return <div>{arr}</div>
  }
})

// 实例化Vue
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
