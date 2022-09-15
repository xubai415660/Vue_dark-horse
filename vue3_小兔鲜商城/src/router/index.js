import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const MyTest = () => import('@/views/test')
const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const FirstCategory = () => import('@/views/category/index')
const SecondCategory = () => import('@/views/category/sub')
const GoodsDetail = () => import('@/views/goods/index')
const Cart = () => import('../views/cart/index.vue')
const PayCheckout = () => import('../views/member/pay/checkout.vue')
const Pay = () => import('../views/member/pay/index.vue')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback.vue')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: FirstCategory },
      { path: '/category/sub/:id', component: SecondCategory },
      { path: '/product/:id', component: GoodsDetail },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: PayCheckout },
      { path: '/member/pay', component: Pay }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  },
  {
    path: '/test',
    component: MyTest
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return {
      // x: 0, y: 0 // vue2
      // left控制页面水平方向滚动
      // top控制垂直方向滚动
      left: 0,
      top: 0
    }
  }
})

// 添加导航守卫
router.beforeEach((to, from, next) => {
  console.log(to.fullPath)
  // 所有的以/member开头的路由路径都需要登录，如果没有登录，需要跳转到登录页面
  const token = store.state.user.profile.token
  // 判断路径是否以/member开头使用ES6提供的方法startsWith
  // 目标地址以/member开头并且token不存在时，需要跳转到登录页面
  if (to.path.startsWith('/member') && !token) {
    // 加入此时目标路径是 /member/pay?num=123
    // 跳转到登录页面的路径：/login?redirectUrl=/member/pay?num=123
    // 携带redirectUrl的作用：登录成功后，可以再调回到之前的页面
    // to.fullPath包含路由路径的完整信息，但是to.path仅仅包含路径而不包含路径后续的参数
    return next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  // 如果上述条件不成立，正常跳转就行
  next()
})

export default router
