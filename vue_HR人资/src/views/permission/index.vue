<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="handleAdd(1,'0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" sortable prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="scopt">
              <el-button v-if="scopt.row.type === 1" size="small" type="text" @click="handleAdd(2, scopt.row.id)">添加权限点</el-button>
              <el-button size="small" type="text" @click="hanleEdit(scopt.row.id)">查看</el-button>
              <el-button size="small" type="text" @click="hanleDelete(scopt.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增编辑的弹层 -->
    <el-dialog :visible="showDialog" :title="formData.id?'编辑权限':'添加权限'" @close="handelClose">
      <!-- 表单内容 -->
      <el-form ref="authForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="是否展示" prop="enVisible">
          <!-- Switch组件用法 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="0"
            inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#eee"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="handelClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqUpdatePermission } from '@/api/permisson.js'
import { translateData } from '@/utils/index.js'

export default {
  name: 'Permission',
  data () {
    return {
      // 角色权限的id
      ruleId: '',
      // 角色权限弹窗
      showAuthDialog: false,
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '权限点名称不能为空', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '权限点编码不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    // 触发
    this.loadPermissionList()
  },
  methods: {
    // 给指定角色进行授权
    assignAuth (id) {
      this.ruleId = id
      // 打开弹窗
      this.showAuthDialog = true
    },
    // 查看修改功能
    async hanleEdit (id) {
      const ret = await reqGetPermissionDetail(id)
      // 把数据填入到表单当中
      this.formData = ret.data
      // 打开弹窗
      this.showDialog = true
    },
    // 删除功能
    hanleDelete (id) {
      this.$confirm('确认要删除员工吗？是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ret = await reqDelPermission(id)
        if (ret.code === 10000) {
          // 删除成功后，刷新列表
          this.loadPermissionList()
          // 关闭弹窗
          this.showDialog = false
        } else {
          this.$message.error(ret.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$message.error('删除失败')
        }
      })
    },
    // 添加编辑权限提交表单
    handleSubmit () {
      this.$refs.authForm.validate(async valid => {
        if (!valid) return
        // 编辑权限
        if (this.formData.id) {
          const ret = await reqUpdatePermission(this.formData)
          if (ret.code === 10000) {
            // 编辑成功后刷新列表
            this.loadPermissionList()
            // 关闭弹窗
            this.handelClose()
          } else {
            this.$message.error(ret.message)
          }
        } else {
        // 添加权限
          try {
            const ret = await reqAddPermission(this.formData)
            if (ret.code === 10000) {
            // 添加成功，刷新列表
              this.loadPermissionList()
              // 关闭弹窗
              this.handelClose()
              // 清空表单(只能重置需要验证的输入域)
              this.$refs.authForm.resetFields() // 保证验证提示默认不显示
              this.formData = this.$options.data().formData
            } else {
              this.$message.error(ret.message)
            }
          } catch {
            this.$message.error('添加权限失败')
          }
        }
      })
    },
    // 加载权限列表数据
    async loadPermissionList () {
      try {
        const ret = await reqGetPermissionList()
        if (ret.code === 10000) {
          // 把列表数据转换为树形结构
          this.list = translateData(ret.data, '0')
        } else {
          this.$message.error(ret.message)
        }
      } catch {
        this.$message.error('获取权限列表失败')
      }
    },
    // 添加弹窗动作
    handleAdd (type, pid) {
      // 设置权限的级别
      this.formData.type = type
      // 设置权限的父节点
      this.formData.pid = pid
      // 显示弹窗
      this.showDialog = true
    },
    // 控制关闭弹窗
    handelClose () {
      this.showDialog = false
      // 置空表单（重置数据）
      this.$refs.authForm.resetFields()
      this.formData = this.$options.data().formData
    }
  }
}
</script>
