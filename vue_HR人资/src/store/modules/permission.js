import { constantRoutes, asyncRoutes } from '@/router/index.js'

const state = {
  // 所有的路由映射（包括静态和动态路由）
  routes: constantRoutes
}

const mutations = {
  // 更新动态路由
  updateRoutes (state, asyncRoutes) {
    // 把最新的动态路由和静态路由合并并覆盖原来的路由
    state.routes = [...constantRoutes, ...asyncRoutes]
  }
}

const actions = {
  // 根据用户的权限筛选其拥有的动态路由
  filterAuth (context, menus) {
    // 参数menus表示当前用户拥有的路由权限
    const myRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.children[0].name)
    })
    // 触发mutation变更路由
    context.commit('updateRoutes', myRoutes)
    // 返回动态路由
    return myRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
