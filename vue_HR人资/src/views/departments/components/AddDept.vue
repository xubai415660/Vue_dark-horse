<template>
  <el-dialog title="添加部门" :visible="isShowDept" :before-close="handleClose" @open="handleOpen">
    <el-form ref="addForm" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="item in elist" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <div slot="footer">
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getEmployeeSimple } from '@/api/employees.js'
import { reqAddDepartments } from '@/api/departments.js'

export default {
  name: 'AddDept',
  props: {
    // 控制弹窗
    isShowDept: {
      type: Boolean,
      required: true
    },
    // 父级部门的id
    deptId: {
      type: String,
      required: true
    },
    // 所有部门的数据
    list: {
      type: Array, // Array数组
      required: true
    }
  },
  data () {
    // 自定义验证规则：---------验证部门名称-----------------
    // rule就是验证规则，callback触发回调函数
    const validateName = (rule, value, callback) => {
      // 同级部门的名称不可以重复
      // 1、找到同级部门信息：根据父级部门的id
      const subDepts = this.list.filter(item => {
        // 当前部门的pid和父级部门的id对比
        return item.pid === this.deptId
      })
      // 2、判断输入的部门名称和同级部门名称是否冲突
      const flag = subDepts.some(item => {
        return item.name === value
      })
      // 判断存在性
      if (flag) {
        // 重复了
        callback(new Error('同级部门名称不可以重复'))
      } else {
        // 不重复
        callback()
      }
    }
    // 自定义验证规则：-------------验证部门编码-----------------------
    const validateCode = (rule, value, callback) => {
      // 部门编码全局不可以重复
      const flag = this.list.some(item => {
        return item.code === value
      })
      if (flag) {
        // 重复了
        callback(new Error('部门编码重复了'))
      } else {
        // 不重复
        callback()
      }
    }
    return {
      // 负责人列表数据
      elist: [],
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: // 部门名称
        [{ required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur'] }],
        code: // 部门编码
        [{ required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: ['blur'] }],
        manager: // 部门管理者
        [{ required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }],
        introduce: // 部门介绍
      [{ required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
        { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    // 添加部门提交表单
    handleSubmit () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          console.log('部门提交')
          try {
            // 表示可以提交了
            await reqAddDepartments({
              ...this.form,
              // 父级部门的id
              pid: this.deptId
            })
            // 关闭弹窗、刷新列表
            this.handleClose()
            this.$emit('on-success')
          } catch {
            this.$message.error('添加部门失败')
          }
        }
      })
    },
    // 获取负责人的列表数据
    async handleOpen () {
      // 弹窗打开时触发
      try {
        const ret = await getEmployeeSimple()
        this.elist = ret.data
      } catch {
        this.$message.error('获取负责人失败')
      }
    },
    // 通知父组件关闭弹窗
    handleClose () {
      // 清空表单
      this.$refs.addForm.resetFields()
      // this.$emit('on-close', false)
      // 通知父组件关闭弹窗-优化
      this.$emit('update:is-show-dept', false)
    }
  }
}
</script>
