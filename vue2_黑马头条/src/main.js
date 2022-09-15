import Vue from 'vue'
import App from './App.vue'
// 如果目录中的文件名称是index.js，那么可以省略
// import router from './router/index.js'
import router from './router'
// 导入Vant和相关样式   图片懒加载
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

// 导入全局样式
import '@/styles/index.less'

// 处理移动端适配问题
// 如下导入的包发挥了什么作用？
// 1、根据 【前端屏幕的宽度w1/当前屏幕的基准值p1 = iPhone6屏幕的跨度w/iPhone屏幕的基准值p公式】，计算当前屏幕的基准p1；
// 2、并且设置到HTML元素上font-size=p1

// 动态设置基准值
import 'amfe-flexible'

// 导入自定义插件
import MyPlugins from '@/utils/plugins.js'
// 所有的import全部要放到最顶部
const JSONbig = require('json-bigint')
// 创建一个Vue实例对象
const eventBus = new Vue()
// 把创建的Vue对象添加到Vue构造函数的原型上，那么所有的组件都可以获取该对象
// 所有的组件都是Vue构造函数的实例
Vue.prototype.eventBus = eventBus

Vue.use(MyPlugins)
// 配置Vant插件
Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

// 把根组件App.vue挂载到index.html页面的id是app的div里面
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

const json = '{ "value" : 1402812699955429376, "v2": 123 }'
const obj = JSON.parse(json)
// {value: 1402812699955429400, v2: 123}
console.log(obj)

JSONbig.parse(json)
