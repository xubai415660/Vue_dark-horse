// 薪资架构模块
import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '薪资', icon: 'money' }
    }
  ]
}
