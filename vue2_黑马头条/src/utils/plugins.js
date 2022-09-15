// Vue插件就是一个对象，对象种必须有一个install方法
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
// 日期国际化
import 'dayjs/locale/zh-cn'
// 给dayjs扩展一个插件
dayjs.extend(relativeTime)

export default {
  install (Vue) {
    // 该方法的形参就是Vue构造函数
    Vue.prototype.$abc = '测试Vue自定义插件机制🐷'
    // 扩展日期格式化过滤器
    Vue.filter('formatTime', function (time) {
      // 基于中文的方式计算time的相对时间
      return dayjs().locale('zh-cn').from(time)
    })
  }
}
