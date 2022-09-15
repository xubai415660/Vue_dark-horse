import { createStore } from 'vuex'
import global from '@/store/modules/global.js'
import user from '@/store/modules/user.js'
import cart from '@/store/modules/cart.js'
import cate from '@/store/modules/cate.js'
import createPersistedstate from 'vuex-persistedstate'

// vue2.0 创建仓库 new Vuex.Store({})
// vue3.0 创建仓库 createStore({})
export default createStore({
  // 全局模块配置
  ...global,
  // 分模块
  modules: {
    user,
    cart,
    cate
  },
  // 配置Vuex的插件
  plugins: [
    // 持久化state触发才可以看到本次存储数据的变化
    createPersistedstate({
      // 存储在缓存中的数据的key
      key: 'erabbit-client-pc-store',
      // 需要存储的模块数据
      paths: ['user', 'cart', 'cate']
    })
  ]
})
