<template>
  <div class="setting-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色管理</span>
      </div>
      <!-- 卡片内容 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <!-- 顶部按钮 -->
          <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAddRole">新增角色</el-button>
          <!-- 角色列表 -->
          <el-table v-loading="loading" :data="list">
            <!-- type='index'表示自增 -->
            <el-table-column type="index" :index="handleIndex" label="序号" width="100" />
            <el-table-column prop="name" label="角色名称" width="240" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作">
              <!-- 标签之前的内容就是插槽的内容 -->
              <!--  通过设置scope slot 来自定义表头 slot-scope="scope"不建议使用 -->
              <template v-slot="scope">
                <el-button size="small" type="success" @click="handleAuth(scope.row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                <!-- handleDelete(scope.$index,scope.row.id)" -->
                <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页条 -->
          <!-- sizes，prev,pager,next,jumper->,total,slot -->
          <!-- slot可以使你在分页栏中自定义内容：通过插槽处理 -->
          <el-pagination
            :current-page="filterParams.page"
            :page-size="filterParams.pagesize"
            layout="prev, pager, next, jumper, slot, total"
            :total="total"
            @current-change="handleCurrentChange"
          >
            <span>叙白🐷</span>
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">公司设置
          <!-- 警告信息 -->
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- 表单 -->
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="alist.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="alist.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="alist.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="alist.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加角色弹出层 -->
    <el-dialog :title="title" :visible.sync="isShowBox" @close="handleClose">
      <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleAdd">确认</el-button>
      </template>
    </el-dialog>
    <!-- 给角色分配权限弹窗 -->
    <!-- 分配权限的弹层 -->
    <!-- :check-strictly="true" 设置为true，可以关闭父子关联（父级节点可以单独选择）  -->
    <el-dialog title="分配权限" :visible.sync="showAuthDialog" @open="loadAuthList">
      <el-tree
        ref="tree"
        :data="permissionData"
        show-checkbox
        node-key="id"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="auths"
        :props="defaultProps"
      />
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reqAssignPerm, reqGetCompanyInfo, reqGetRoleList, reqDeleteRole, reqAddRole, reqGetRoleDetail, reqUpdateRole } from '@/api/setting.js'
import { reqGetPermissionList } from '@/api/permisson.js'
import { translateData } from '@/utils/index.js'
import { mapState } from 'vuex'

export default {
  name: 'Setting',
  data () {
    return {
      // 角色拥有的权限
      auths: [],
      // 控制树形展示
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 权限存储列表数据
      permissionData: [],
      // 当前分配权限的角色ID
      roleId: '',
      // 控制角色分配权限的弹窗
      showAuthDialog: false,
      // 添加角色表单数据
      form: {
        name: '',
        description: ''
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ]
      },
      // 控制添加角色的弹窗
      isShowBox: false,
      // 列表加载状态
      loading: false,
      // 当前选项卡
      activeName: 'first',
      // 查询参数
      filterParams: { page: 1, pagesize: 4 },
      // 角色列表的总数
      total: 0,
      // 列表数据
      list: [],
      // 公司信息
      alist: []
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    title () {
      return this.form.id ? '编辑角色' : '添加角色'
    }
  },
  created () {
    this.loadRoleList() // 触发角色列表的数据
  },
  methods: {
    handleAddRole () {
      if (this.$isOk('POINT-USER-ADD1')) { this.isShowBox = true }
    },
    async handleSubmit () {
      // 分配权限的提交动作
      const ret = await reqAssignPerm({
        // 1、需要分配权限的角色id
        id: this.roleId,
        // 2、重新选中的权限节点的ids
        permIds: this.$refs.tree.getCheckedKeys()
      })
      if (ret.code === 10000) {
        // 授权成功，关闭弹窗
        this.showAuthDialog = false
      } else {
        this.$message.error(ret.message)
      }
    },
    // 加载角色的权限数据
    loadAuthList () {
      try {
        // 获取所有的权限列表
        const allAuth = reqGetPermissionList()
        // ---------------------------------------
        // 获取角色本来拥有的权限列表
        const roleAuth = reqGetRoleDetail(this.roleId)
        // 基于Promise的all方法并发的触发两个任务
        Promise.all([allAuth, roleAuth]).then(results => {
          this.permissionData = translateData(results[0].data, '0')
          // el-tree组件的default-checked-keys树形的值是节点的id组成的数组，用于选中节点。
          this.auths = results[1].data.permIds
          // this.$nextTick(() => {
          //   // 保证整个树完成渲染后，再控制节点的选中
          //   this.$refs.tree.setCheckedKeys(this.auths)
          // })
        })
      } catch {
        this.$message.error('获取权限列表失败')
      }
    },
    // 显示分配权限弹窗
    handleAuth (id) {
      this.roleId = id
      // 显示弹窗
      this.showAuthDialog = true
    },
    // 公司信息
    async changeTab ({ name }) {
      // 参数的解构赋值
      if (name === 'company') {
        try {
          // 获取公司的基本信息
          const ret = await reqGetCompanyInfo(this.userInfo.companyId)
          console.log(ret)
          this.alist = ret.data
          if (!ret.success) {
            this.$message.error(ret.message)
          }
        } catch {
          this.$message.error('获取公司信息失败')
        }
      }
    },
    // 编辑角色：获取id，显示弹窗
    async handleEdit (id) {
      // 显示弹窗
      this.isShowBox = true
      try {
        const ret = await reqGetRoleDetail(id)
        this.form = ret.data
      } catch {
        this.$message.error('获取角色数据失败')
      }
    },
    // 取消操作,重置表单
    handleClose () {
      // 弹窗关闭时自动触发
      this.isShowBox = false
      // 清空表单（需要保证el-form-item组件添加prop属性）
      this.$refs.roleForm.resetFields()
      // 重置表单的另一种做法
      // this.$options.data()可以获取data中的所有初始数据
      this.form = this.$options.data().form
    },
    // 添加角色，提交表单-----编辑角色
    handleAdd () {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
        // ----------------------------编辑操作--------------------------------
        if (this.form.id) {
          try {
            const ret = await reqUpdateRole(this.form)
            if (ret.code === 10000) {
            // 编辑成功，关闭弹窗，刷新列表
              this.isShowBox = false
              this.loadRoleList()
            } else {
              this.$message.error(ret.message)
            }
          } catch {
            this.$message.error('编辑角色失败')
          }
        } else {
          // -----------------添加操作-------------------------------
          try {
            const ret = await reqAddRole(this.form)
            if (ret.code === 10000) {
              // 添加成功后关闭弹窗
              this.isShowBox = false
              // 刷新列表
              this.loadRoleList()
            } else {
              this.$message.error('添加角色失败')
            }
          } catch {
            this.$message.error('添加角色失败')
          }
        }
      })
    },
    // --------------------------删除角色--------------------------------
    handleDelete (id) {
      // 删除部门（删除前进行提示）
      this.$confirm('确认要删除角色吗？ 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击确定
        const ret = await reqDeleteRole(id)
        // 删除角色成功，刷新列表
        if (ret.code === 10000) {
          this.loadRoleList()
        } else {
          this.$message.error(ret.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          // 点击取消
          this.$message.error('删除角色失败')
        }
      })
    },
    // 动态计算累加的索引
    handleIndex (index) {
      // 形参index表示列表数据的索引，从0开始
      // （当前页码-1）* 每页的条数
      const { page, pagesize } = this.filterParams
      return (page - 1) * pagesize + index + 1
      // ------------------第二种写法---------------------------
      // return (this.filterParams.page - 1) * this.filterParams.pagesize + index + 1
    },
    // 分页
    handleCurrentChange (page) {
      // 当分页组件发生页码变化时自动触发
      // page表示当前页码，页码变化后需要的操作：修改页码值，从新调用接口
      this.filterParams.page = page
      this.loadRoleList()
    },
    // 加载角色列表的数据
    async loadRoleList () {
      try {
        this.loading = true
        const ret = await reqGetRoleList(this.filterParams)
        this.total = ret.data.total
        this.list = ret.data.rows
      } catch {
        this.$message.errot('获取角色列表失败')
      }
      this.loading = false
    }
  }
}
</script>
