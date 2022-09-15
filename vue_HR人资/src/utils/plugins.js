// 定义一个Vue插件并导出
import PageTools from '@/components/PageTools'
import moment from 'moment'
// 导入组件
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ScreenFull from '@/components/ScreenFull'
import LangChange from '@/components/LangChange'
import store from '@/store/index.js'
import { Message } from 'element-ui'

// 定义一个Vue插件并导出
export default {
  // Vue.use(MyPlugins,"defaultimg.png')
  // Vue.use的参数二传递给install方法的第三个参数options
  install (Vue, options) {
    // 扩展一个自定义指令，处理图片加载失败的情况
    Vue.directive('imgerror', {
      inserted (el, bindings) {
        // el表示指令绑定的元素
        // bindings包含指令相关的参数信息
        console.log(bindings)
        // 图片加载成功
        // el.onload = function () {}
        // 图片加载失败
        el.onerror = function () {
          // 加载失败后触发该函数
          el.src = bindings.value || options.defaultImg
        }
      },
      // 如果手动把src的值置空（删除头像），显示默认头像
      componentUpdated (el, binding) {
        // 如果src没有赋值, 给默认src
        el.src = el.src || binding.value
      }
    })
    // 配置全局组件
    Vue.component('PageTools', PageTools)
    // 进行组件的全局注册
    Vue.component('UploadExcel', UploadExcel) // 注册导入Excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.component('ScreenFull', ScreenFull) // 全屏组件
    Vue.component('LangChange', LangChange) // 语言
    // 扩展过滤器
    Vue.filter('formatData', (value) => {
      return moment(value).format('yyyy-MM-DD')
    })
    // 扩展一个实例方法 $isOk, 用于判断当前用户对某个按钮是否拥有操作权限
    Vue.prototype.$isOk = authPoint => {
      // 获取当前用户拥有的所有权限点
      const points = store.state.user.userInfo.roles.points
      // 判断特定按钮是否有权限
      const flag = points.includes(authPoint)
      if (flag) {
        return true
      } else {
        Message.error('没有该操作权限！')
        return false
      }
    }
  }
}
