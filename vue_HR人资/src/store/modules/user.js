// 用户模块
import { login, getInfo, getDetailInfo } from '@/api/user.js'
import { setToken, getToken, removeToken } from '@/utils/auth.js'

export default {
  namespaced: true,
  // 管理组件数据
  state: {
    // 页面打开时，从缓存中读取token，初始化状态中的token
    token: getToken() || null, // token字符串
    // 用户信息
    userInfo: null
  },
  // 更新组件数据
  mutations: {
    // 更新用户信息
    updateToken (state, payload) {
      // 修改状态
      state.token = payload
      // 把token一块存储到缓存中
      setToken(payload)
    },
    // 更新用户头像信息
    updateUserInfo (state, payload) {
      // 初始化用户信息
      state.userInfo = payload
      // --------------第一种方法--------------------
      // // 初始化用户信息
      // if (state.userInfo) {
      //   // 原来有值（合并两个对象的所有属性到一块）
      //   state.userInfo = {
      //     ...state.userInfo,
      //     ...payload
      //   }
      // } else {
      //   // 第一次给他初始化
      //   state.userInfo = payload
      // }
    },
    // 删除缓存中的token
    removeToken (state) {
      // 清楚token的信息
      state.token = null
      // 删除缓存中的token
      removeToken()
    }
  },
  // 请求数据
  actions: {
    // 实现登录的Action
    async login (context, payload) {
      try {
        // 调用后端接口，获取返回的结果
        const ret = await login(payload)
        if (ret.code === 10000) {
          // 登录成功，缓存token
          // sessionStorage.setItem('mytoken', ret.data.data)
          // 触发mutation修改state中token值
          // 这里触发的mutation默认就是当前模块的mutation
          context.commit('updateToken', ret.data)
          // 触发全局模块的mutation
          context.commit('showInfo', ret.data, { root: true })
          return true
        } else {
          // 登录失败
          return false
        }
      } catch {
        // 登录失败（网络错误）
        return false
      }
    },
    // 获取用户基本信息
    async getInfo (context) {
      // 调用接口获取用户基本数据
      try {
        const info = await getInfo()
        // 调用接口获取用户详细数据
        const detail = await getDetailInfo(info.data.userId)
        // 更新用户数据
        context.commit('updateUserInfo', {
          ...info.data,
          ...detail.data
        })
      } catch {
        // 登录成功打印
        console.log('tryCatch')
      }
    }
    // ----------------第一种办法-------------------------
    /* async getInfo (context) {
      // 调用接口获取数据
      const ret = await getInfo()
      // 初始化用户信息
      context.commit('updateUserInfo', ret.data)
      // 返回用户id
      return ret.data.userId
    },
    // 获取用户头像
    async getDetailInfo (context, id) {
      // 根据用户的id获取头像等详细信息
      const ret = await getDetailInfo(id)
      // 更新用户信息的状态值
      context.commit('updateUserInfo', ret.data)
    } */
  }
}
