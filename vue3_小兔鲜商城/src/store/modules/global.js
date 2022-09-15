// 全局模块
export default {
  // 数据
  state: {
    info: '王浩'
  },
  // vuex的计算属性
  getters: {
    fullInfo (state) {
      return state.info + '😁😁😁'
    }
  },
  // 改数据函数
  mutations: {
    updateInfo (state, payload) {
      state.info = payload
    }
  },
  // 请求数据函数
  actions: {
    updateInfo (context, payload) {
      // 发送请求
      setTimeout(() => {
        context.commit('updateInfo', payload)
      }, 1000)
    }
  }
}
