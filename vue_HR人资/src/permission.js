import router from '@/router/index.js'
import store from '@/store/index.js'
// import { asyncRoutes } from '@/router/index.js'

// 准备白名单
const whiteList = ['/login', '404', 'abc']
// 配置导航守卫
router.beforeEach(async (to, from, next) => {
  // 判断token的存在性
  // 从vuex中获取token信息
  const token = store.getters.token
  if (token) {
    // 存在：判断是否为登录页面
    if (to.path === '/login') {
      // 是登录页面，跳转到主页面
      next('/')
    } else {
      // 不是登录页面，直接放行通过
      // 获取用户的信息（路由菜单信息）
      // 为什么需要判断用户信息是否存在？（我们认为登录系统后已经得到了用户信息）
      // 但是，获取用户信息的流程是异步的，路由访问时，用户信息尚未返回
      if (store.getters.userId) {
        next()
      } else {
        // 用户信息不存在，获取用户信息
        await store.dispatch('user/getInfo')
        // await之后是可以获取用户信息的（menu）
        const menus = store.state.user.userInfo.roles.menus
        // 下一步通过menus控制当前用户的路由权限
        // 根据menus信息从所有的动态路由asyncRoutes中过滤出该用户所拥有的动态路由
        // const myRoutes = asyncRoutes.filter(item => {
        //   return menus.includes(item.children[0].name)
        // })
        // 通过action过滤用户的路由权限，把路由映射信息存储在Store中
        // action的返回值表示当前用户所拥有的动态路由
        const myRoutes = await store.dispatch('permission/filterAuth', menus)
        // 动态配置路由
        router.addRoutes([...myRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 继续跳转当前路由
        next({
          ...to,
          // 仅仅保留一个跳转历史（如果动态添加路由了，那么路由需要重新访问一次，这样的话，同样的路径访问的两次，路由历史重复了，不友好，所以可以把这两个合并为一个）
          replace: true
        })
      }
    }
  } else {
    // 不存在,判断是否请求的路径在白名单里面
    if (whiteList.includes(to.path)) {
      // 在白名单里面，放行通过即可
      next()
    } else {
      // 不在白名单里面，跳转到登录页面
      router.push('/login')
    }
  }
})
