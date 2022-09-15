import Vue from 'vue'
import Vuex from 'vuex'
// 导入全局模块
import global from './modules/global'
// 导入局部模块
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission
  },
  // vuex中除了局部模块之外，也可以有全局模块
  ...global
})

export default store
