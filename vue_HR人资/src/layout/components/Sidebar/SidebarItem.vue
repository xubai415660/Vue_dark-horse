<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!-- app-link 用于实现路由跳转 -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- onlyOneChild其实就是二级路哟的映射对象 -->
          <!-- item组件用于显示菜单的图标和标题文本 -->
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="$t('route.'+onlyOneChild.name)" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 左侧子菜单，我们不需要 -->
    <!-- <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu> -->
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object 路由对象
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 二级路由的映射没有hidden，并且长度是一时，显示这个菜单
    hasOneShowingChild (children = [], parent) {
      // 参数支持 默认值：ES6的规则
      // 过滤出需要显示的路由映射
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // 二级路由映射的对象
          this.onlyOneChild = item
          return true
        }
      })

      // 如果仅仅是一个二级路由，就直接显示它
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有二级路由，就直接显示一级路由
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
