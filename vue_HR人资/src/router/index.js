import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// ---------组织架构模块---------------------
import Layout from '@/layout/index.vue'

// --------导入多个路由模块------------------
// 审批模块
import approvalsRouter from '@/router/modules/approvals.js'
// 组织架构模块
import departmentsRouter from '@/router/modules/departments.js'
// 员工模块
import employeesRouter from '@/router/modules/employees.js'
// 权限管理模块
import permissionRouter from '@/router/modules/permission.js'
// 考勤模块
import attendancesRouter from '@/router/modules/attendances.js'
// 薪资模块
import salarysRouter from '@/router/modules/salarys.js'
// 角色管理模块
import settingRouter from '@/router/modules/setting.js'
// 社保模块
import socialRouter from '@/router/modules/social.js'

// 静态路由:所有的用户都可以看到
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // 配置 true,  就是将来不渲染菜单（除了hidden之外也与children属性有关）
    hidden: true
  },
  // 404模块
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页模块
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [{
      path: '', // 二级路由path什么都不写 表示二级默认路由
      component: () => import('@/views/import')
    }]
  }
  // 没有匹配到的页面, 走404
  // { path: '*', redirect: '/404', hidden: true }
]

// 动态路由:有权限的可以看到,否则看不到
export const asyncRoutes = [
  departmentsRouter, // 组织架构
  employeesRouter, // 员工
  settingRouter, // 角色管理
  permissionRouter, // 权限管理
  socialRouter, // 社保
  attendancesRouter, // 考勤
  salarysRouter, // 薪资
  approvalsRouter // 审批
]

export const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    // 管理滚动行为, 让页面切换时回到顶部
    scrollBehavior: () => ({ y: 0 }),
    // 临时合并动态路由和静态路由
    routes: [
      // 路由权限显示---
      ...constantRoutes, ...asyncRoutes
    // ...asyncRoutes
    ]
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 把路由信息重置为静态路由
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
