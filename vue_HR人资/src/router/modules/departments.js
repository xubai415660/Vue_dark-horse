// 组织架构模块
import Layout from '@/layout'

export default {
  path: '/department',
  component: Layout,
  children: [{
    // 如果二级路由是空的，表示默认显示的路由
    path: '',
    name: 'departments',
    component: () => import('@/views/departments/index'),
    meta: { title: '组织架构', icon: 'tree' }
  }]
}
