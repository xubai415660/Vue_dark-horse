import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Main from '@/views/main/index.vue'
import Video from '@/views/video/index.vue'
import Question from '@/views/question/index.vue'
import Search from '@/views/search/index.vue'
import Sresult from '@/views/search/sresult.vue'
import Article from '@/views/detail/index.vue'
import My from '@/views/my/index.vue'
import Chat from '@/views/chat/chat.vue' // 小智同学
import TestSlot from '@/views/test/TestSlot.vue'
import CacheA from '@/views/question/CacheA.vue'
import CacheB from '@/views/question/CacheB.vue'

// 搜索组件

Vue.use(VueRouter)

// 配置路由映射时，name属性可以给路由的路径起一个别名
// 跳转路由时，可以使用name进行跳转
// this.$router.push('/about')
// this.$router.push({name: 'About'})
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/home/main',
    children: [
      { path: 'main', component: Main, meta: { keepAlive: true, auth: true } },
      { path: 'video', component: Video },
      // 普通组件的缓存效果
      {
        path: 'question',
        component: Question,
        children: [
          { path: 'a', component: CacheA },
          { path: 'b', component: CacheB }
        ]
      },
      { path: 'my', component: My }
    ]
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/slot', name: 'slot', component: TestSlot },
  { path: '/search', name: 'search', component: Search }, // 搜索跳转
  { path: '/sresult', name: 'Sresult', component: Sresult },
  { path: '/detail', name: 'Article', component: Article }, // 文章详情
  { path: '/chat', name: 'Chat', component: Chat } // 小智同学
]

const router = new VueRouter({
  routes
})

// 全局前置导航守卫（路由跳转到目标组件之前先经过导航守卫）
// 拦截所有的路由请求
router.beforeEach((to, from, next) => {
  // to表示要跳转到哪里去
  // from表示从哪里跳转过来
  // next表示继续跳转，如果不调用该函数，是无法看到组件的
  if (to.meta.auth) {
    // 如果条件成立，不需要做权限验证，可以直接访问对应的组件路由
    return next()
  }
  // 判断用户是否已经登录
  // 1、如果已经登录运行跳转
  // 2、如果没有登录，跳转到登录页面
  const user = JSON.parse(sessionStorage.getItem('mytoken'))
  // user必须存在，并且user.token 和 user.refresh_token也必须存在
  const flag = user && user.token && user.refresh_token
  if (!flag && to.path !== '/login') {
    // 没有登录 并且 不是登录组件，此时应该直接跳转到登录页
    next('/login')
  } else {
    // 已经登录,正常跳转到当前路径
    next()
  }
})
export default router
