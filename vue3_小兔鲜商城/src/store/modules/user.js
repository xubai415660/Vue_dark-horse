// 用户信息模块（状态）
export default {
  namespaced: true,
  state: () => {
    return {
      title: '用户信息',
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  mutations: {
    updateUserInfo (state, payload) {
      state.profile = payload
    }
  },
  actions: {},
  getters: {}
}
