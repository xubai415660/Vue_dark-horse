// 角色管理架构模块
import Layout from '@/layout'

export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: '',
      name: 'setting',
      component: () => import('@/views/setting'),
      meta: { title: '角色管理', icon: 'setting' }
    }
  ]
}
