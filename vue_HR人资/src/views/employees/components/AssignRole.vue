<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @open="loadRoleList" @close="handleClose">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <div style="text-align: right">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { reqGetRoleList } from '@/api/setting.js'
import { reqAssignRoles } from '@/api/employees.js'
import { getDetailInfo } from '@/api/user.js'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      required: true
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      // 选中的角色ids
      roleIds: [],
      // 角色列表
      list: []
    }
  },
  created () {
    // 获取角色列表数据
    this.loadRoleList()
  },
  methods: {
    // 给员工分配角色
    async handleSubmit () {
      const ret = await reqAssignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      if (ret.code === 10000) {
        // 分配角色成功，关闭弹窗
        this.handleClose()
      } else {
        this.$message.error(ret.message)
      }
    },
    // 基于Promise的一个方法优化
    // 加载角色类别数据
    async loadRoleList () {
      // 开启加载状态
      this.loading = true
      // 获取所有的角色信息
      const allRoles = reqGetRoleList({
        page: 1,
        pagesize: 1000
      })
      // 获取当前用户的角色信息
      const currentRoles = getDetailInfo(this.userId)
      // 并行触发多个异步任务
      // Promise.race([]).then(result=>{})
      Promise.all([allRoles, currentRoles]).then(results => {
        // results中包含所有任务的结果，结果的顺序与数组中任务的顺序一致
        // 所有的任务都完成后，触发then方法并获取所有的任务结果
        console.log(results)
        this.list = results[0].data.rows
        this.roleIds = results[1].data && results[1].data.roleIds
        // 隐藏加载状态
        this.loading = false
      }).catch((err) => {
        console.log(err)
        this.$message.success('获取角色列表数据成功')
      })
    },
    // async loadRoleList () {
    //   this.loading = true
    //   // 获取所有的角色数据
    //   const ret = await reqGetRoleList({
    //     page: 1, pagesize: 100
    //   })
    //   if (ret.code === 10000) {
    //     this.list = ret.data.rows
    //   } else {
    //     this.$message.error(ret.message)
    //   }
    //   // 获取当前的用户角色信息
    //   const currentRoles = await getDetailInfo(this.userId)
    //   // 初始化选中的角色
    //   if (currentRoles.code === 10000) {
    //     this.roleIds = currentRoles.data.roleIds
    //     this.loading = false
    //   } else {
    //     this.$message.success(ret.message)
    //   }
    // },
    // 关闭弹窗
    handleClose () {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.assign-role {
  ::v-deep {
    .el-checkbox {
      font-size: 30px;
    }
  }
}
</style>
