// 分类信息模块
import { findHeadCategory } from '@/api/home.js'
import { category } from '@/api/constants.js'
export default {
  namespaced: true,
  state: () => {
    return {
      title: '分类模块',
      // 分类列表数据(提供默认数据，防止默认出现长时间的空白效果 )
      // [id:0,{name:"居家"}...]
      list: category.map((item, index) => ({ id: index, name: item }))
    }
  },
  // 加载数据成功后需要修改list所以需要mutations函数
  mutations: {
    setList (state, payload) {
      state.list = payload
    },
    // 控制二级分类的显示
    show (state, id) {
      // id表示一级分类的id
      const cate = state.list.find(item => {
        return item.id === id
      })
      // 修改当前一级分类下的open数据为true
      cate.open = true
    },
    // 控制二级分类的隐藏
    hide (state, id) {
      // id表示一级分类的id
      const cate = state.list.find(item => {
        return item.id === id
      })
      // 修改当前一级分类下的open数据为false
      cate.open = false
    }
  },
  // 需要向后台加载数据，所以需要actions函数获取数据
  actions: {
    async setList (context) {
      // 1.调用接口方法
      const ret = await findHeadCategory()
      // 2.给每一个一级分类的数据添加一个open标志位，用于控制他的二级分类的打开和隐藏
      ret.result.forEach(item => {
        item.open = false
      })
      // 3.成功获取到数据之后触发setList mutation函数
      context.commit('setList', ret.result)
    }
  },
  getters: {}
}
