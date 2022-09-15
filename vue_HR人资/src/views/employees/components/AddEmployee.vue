<template>
  <el-dialog title="新增员工" :visible="showDialog" top="8vh" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDeptList" />
        <!-- 如果类名直接添加到组件的标签上，渲染的结果是放在组件上的根节点上 -->
        <div v-if="showTree" class="tree-box">
          <el-tree
            v-loading="loading"
            :data="departs"
            :props="{ label: 'name' }"
            @node-click="selectNode"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import Types from '@/api/constant/employees.js'
import { reqGetDepartments } from '@/api/departments.js'
import { reqAddEmployee } from '@/api/employees.js'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 控制及树形结构显示和隐藏
      showTree: false,
      //   树的加载状态
      loading: false,
      // 定义数组接受树形数据
      departs: [],
      // 聘用形式的下拉数据
      hireType: Types.hireType,
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    //   添加部门提交表单
    handleSubmit () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        try {
          const ret = await reqAddEmployee(this.formData)
          if (ret.code === 10000) {
          // 添加成功，刷新列表（通知父组件刷新列表）
          // this.$parent表示父组件实例对象
          // 刷新列表（调用负责父组件方法）
            this.$parent.loadEmployeeList()
            // 关闭弹窗:通知父组件关闭
            this.$emit('update:showDialog', false)
          } else {
            this.$message.error(ret.message)
          }
        } catch {
          this.$message.error('添加员工失败！')
        }
      })
    },
    // 选中树形部门其中一个节点
    selectNode (dept) {
      // 选中所属部门的节点（智能选中叶子节点）
      if (dept.children && dept.children.length > 0) return
      //   选中节点
      this.formData.departmentName = dept.name
      // 隐藏树形结构
      this.showTree = false
    },
    // 把列表数据转换为树形结构
    translateData (list, pid) {
      const treeData = []
      // 自己设计算法做转换
      list.forEach(item => {
        if (item.pid === pid) {
          // 查找该元素的子元素，如果找到子元素后，以children属性方式添加到对象里面
          const childList = this.translateData(list, item.id)
          if (childList && childList.length > 0) {
            // 找到了子元素
            item.children = childList
          }
          treeData.push(item)
        }
      })
      return treeData
    },
    // 调用接口获取组织架构的数据
    async getDeptList () {
      try {
        // 显示树形列表
        this.showTree = true
        // 启用加载状态
        this.loading = true
        // 这里获取的原始部门数据是数组
        const ret = await reqGetDepartments()
        // 把列表数据转换为树形数据
        this.departs = this.translateData(ret.data.depts, '')
        this.loading = false
      } catch {
        this.$message.error('获取组织架构数据失败')
      }
    },
    // 关闭弹窗：通知父组件关闭--------重置表单-----------
    handleClose () {
      this.$emit('update:showDialog', false)
      // 重置表单(只能重置需要验证的输入域)
      this.$refs.addForm.resetFields() // 保证验证提示默认不显示
      // this.formData = this.$options.data().formData
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
}
</style>
