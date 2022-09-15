<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%;">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleAction">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!nodeData.root" command="edit">编辑部分</el-dropdown-item>
              <el-dropdown-item v-if="!nodeData.root" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { reqDelDepartments } from '@/api/departments.js'

export default {
  name: 'TreeTools',
  props: {
    // 节点的内容展示
    nodeData: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleAction (type) {
      if (type === 'add') {
        // 添加子部门:通知父组件打开添加部门的弹窗并且传递当前部门的id
        this.$emit('add-dept', this.nodeData.id)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('edit-dept', this.nodeData)
      } else if (type === 'del') {
        // 删除部门
        this.$confirm('确认要删除部门吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 调用接口，进行删除
        }).then(async () => {
          // 确定删除
          const ret = await reqDelDepartments(this.nodeData.id)
          // 删除成功后，刷新列表（通知父组件就行刷新）
          if (ret.code === 10000) {
            // 删除成功
            this.$emit('on-success')
          } else {
            // 删除失败后提示操作
            this.$message.error(ret.message)
          }
        }).catch((err) => {
          if (err === 'cancel') {
            // 点击了取消,
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除部门失败'
            })
          }
        })
      }
    }
  }
}
</script>
