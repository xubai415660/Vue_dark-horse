import Cookies from 'js-cookie'
// sidebar一空有三个地方需要用到
// 1.值的初始化操作
// 2.他的值是以全卷getters的方式提供给组件
// 3.点击汉堡图标触发active修改这个值即可
const state = {
  sidebar: {
    // !!+保证 后面的值必须是布尔值
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  // 修改控制菜单的状态位的值
  TOGGLE_SIDEBAR: state => {
    // 把状态位取反
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    // 把菜单的状态保存到缓存当中（Cookie）
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
