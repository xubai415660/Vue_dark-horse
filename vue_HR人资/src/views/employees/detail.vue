<template>
  <div class="employees-detail-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <!-- 放置表单 -->
            <el-form ref="pwdForm" :model="pwdInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="pwdInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="pwdInfo.password" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleUpdate">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 打印按钮 -->
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${id}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <!-- 放置个人详情 -->
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 打印按钮 -->
            <el-tooltip class="tooltip-box" content="打印基本岗位信息">
              <router-link :to="`/employees/print/${id}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <!-- 放置岗位信息 -->
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getDetailInfo } from '@/api/user.js'
import { reqSaveUserDetailById } from '@/api/employees.js'
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  props: {
    // 当前要处理的用户id
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 用于重置密码的信息
      pwdInfo: {
        username: '',
        password: ''
      },
      // 用于表单验证
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不可以为空', trigger: ['blur', 'change'] },
          { min: 6, max: 9, message: '密码必须是6-9位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    //   重置密码
    handleUpdate () {
      this.$refs.pwdForm.validate(async valid => {
        if (!valid) return
        try {
          const ret = await reqSaveUserDetailById({
            ...this.pwdInfo,
            // 需要用输入的用户密码覆盖原来的从后端查询的密码
            id: this.id
          })
          if (!ret.success) {
            this.$message.error(ret.message)
          } else {
            this.$message.success('重置密码成功')
          }
        } catch {
          this.$message.error('重置密码失败')
        }
      })
    },
    // 获取用户信息
    async  loadUserInfo () {
      const ret = await getDetailInfo(this.id)
      this.pwdInfo.username = ret.data.username
    }
  }
}
</script>
<style lang="scss" scoped>
.employees-detail-container {
  .el-tab-pane {
    padding-top: 10px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>
