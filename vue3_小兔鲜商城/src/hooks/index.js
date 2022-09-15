// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
// 数据懒加载函数
export const useLazyData = apiFn => {
  // 参数apiFn表示调用接口的方法
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // 触发一次之后，取消继续监听
      stop()
      // 调用API获取数据（被监听的Dom元素已经进入可视区，此时调用接口）
      apiFn().then(data => {
        result.value = data.result
      })
    }
  }, {
    // 刚一进入可是去，就触发（默认值表示，进入一段距离之后才触发）
    threshold: 0
  })
  // 返回--->数据（dom,后台数据）
  //   1.target表示被监听的DOM元素
  //   2.result表示调用接口apiFn返回的数据
  return { target, result }
}
