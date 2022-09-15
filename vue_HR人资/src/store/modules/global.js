// 全局模块
// import getters from '@/store/getters.js'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // 建立用户名称的映射
  avatar: state => state.user.userInfo && state.user.userInfo.staffPhoto,
  uname: state => state.user.userInfo && state.user.userInfo.username,
  userId: state => state.user.userInfo && state.user.userInfo.userId,
  routes: state => state.permission.routes
}

const mutations = {
  showInfo (context, payload) {
    console.log('--------------' + payload)
  }
}

export default {
  getters: getters,
  state: {},
  mutations: mutations,
  actions: {}
}
