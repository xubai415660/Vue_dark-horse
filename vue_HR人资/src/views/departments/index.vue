<template>
  <div v-loading="loading" class="department-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <tree-tools :node-data="titleData" @on-success="onSuccess" @add-dept="addDept" />
      <!-- 树形菜单 -->
      <el-tree :data="departs" :props="defaultProps">
        <!-- 中间的代码就是插槽内容，用于定制每一行的布局效果 -->
        <template v-slot="scope">
          <tree-tools :node-data="scope.data" @on-success="onSuccess" @add-dept="addDept" @edit-dept="editDept" />
        </template>
      </el-tree>
    </el-card>
    <!-- 添加部门弹窗组件 -->
    <!-- <add-dept :is-show-dept="isShowDept" @on-close="isShowDept=$event" /> -->
    <add-dept :list="dlist" :dept-id="currentDeptId" :is-show-dept.sync="isShowDept" @on-success="onSuccess" />
    <!--编辑部门弹窗组件 -->
    <edit-dept :list="dlist" :is-show-dept-edit.sync="isShowDeptEdit" :dept-info="currentDeptInfo" @on-success="onSuccess" />
  </div>
</template>

<script>
import TreeTools from './components/TreeTools.vue'
import AddDept from './components/AddDept.vue'
import EditDept from './components/EditDept.vue'
import { reqGetDepartments } from '@/api/departments.js'
import { translateData } from '@/utils/index.js'

export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept,
    EditDept
  },
  data () {
    return {
      // 控制页面的加载状态
      loading: false,
      // 当前编辑的部门信息
      currentDeptInfo: {},
      // 编辑窗口状态位
      isShowDeptEdit: false,
      // 当前部门的id
      currentDeptId: '',
      // 部门列表的原始数据
      dlist: [],
      // 控制添加部门的弹窗效果
      isShowDept: false,
      // 标题的数据
      titleData: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人',
        // 一级部门的父id
        id: '',
        root: true
      },
      // 组织架构的所有列表数据
      departs: [
        { name: '总裁办', manager: '曹操', pid: '', id: 1 },
        { name: '董事会', manager: '曹丕', pid: 1, id: 11 },
        { name: '秘书部', manager: '张三', pid: 1, id: 12 },
        { name: '秘书部1', manager: '张三', pid: 12, id: 121 },
        { name: '行政部', manager: '刘备', pid: '', id: 2 },
        { name: '人事部', manager: '孙权', pid: '', id: 3 }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.loadDepartList()
  },
  methods: {
    editDept (deptInfo) {
      // 点击编辑按钮,显示编辑弹窗
      // this.currentDeptId = id
      this.currentDeptInfo = deptInfo
      this.isShowDeptEdit = true
    },
    // 控制弹窗
    addDept (id) {
      // 控制添加部门的弹窗效果，并且得到部门id
      this.currentDeptId = id
      this.isShowDept = true
    },
    onSuccess () {
      // 刷新页面
      this.loadDepartList()
    },
    async loadDepartList () {
      // 调用接口获取组织架构的数据
      try {
        // 启动加载状态
        this.loading = true
        const ret = await reqGetDepartments()
        this.titleData.name = ret.data.companyName
        // 把列表数据转换为树形数据
        this.dlist = ret.data.depts
        this.departs = translateData(ret.data.depts, '')
      } catch {
        // 测试代码
        this.departs = translateData(this.departs, '')
        this.$message.error('获取组织架构数据失败')
      }
      // 加载状态
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
}
</style>
