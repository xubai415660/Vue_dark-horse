<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar title="登录" />
    <!-- 表单 -->
    <van-cell-group>
      <!-- @blur="validateMobile" :error-message="mobileMsg"   @blur失去焦点验证 表单验证-->
      <van-form validate-first @failed="onFailed">
        <van-field
          :rules="mobileRules"
          v-model="mobile"
          label="手机号"
          placeholder="请输入手机号"
        />
        <!-- :rules="codeRules" @blur="validateCode"  @blur失去焦点验证  表单验证 -->
        <van-field
          :rules="codeRules"
          v-model="code"
          label="验证码"
          placeholder="请输入验证码"
        >
          <!-- #button 就是具名插槽的用法 -->
          <template #button>
            <van-button class="p5" size="mini" type="primary">
              发送验证码
            </van-button>
          </template>
        </van-field>
      </van-form>
    </van-cell-group>
    <!-- 提交按钮 -->
    <div class="btn">
      <van-button
        :loading="isLoading"
        @click="handleLogin"
        type="info"
        block
        round
        >登录</van-button
      >
    </div>
  </div>
</template>
<script>
// import request from '@/utils/request'
import { login } from '@/api/login.js'

export default {
  // name属性的作用：给组件起一个名称，方便在调试工具中查看
  name: 'MyLogin',
  data () {
    return {
      // 登录按钮的加载状态
      isLoading: false,
      // 手机号
      mobile: '',
      // 验证码
      code: '',
      // 错误提示-手机号
      // mobileMsg: '',
      // 错误提示-验证码
      // codeMsg: ''
      mobileRules: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机号' }],
      codeRules: [{ pattern: /^\d{6}$/, message: '请输入验证码' }]
    }
  },
  methods: {
    onSuccess () {
      // 表单验证通过后触发
      console.log('success')
    },
    onFailed (error) {
      // 验证失败后触发
      console.log(error)
    },
    /* validateMobile () {
      // 验证手机号
      const value = this.mobile
      if (!value) {
        // 手机号不存在
        this.mobileMsg = '手机号不存在'
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        // 验证手机号的格式
        // 原生js中的方法test作用：判断value是否符合正则表达式
        this.mobileMsg = '手机号格式错误'
      } else {
        // 验证通过
        this.mobileMsg = ''
      }
    },
    validateCode () {
      // 验证验证码
      const value = this.code
      if (!value) {
        // 验证码不能为空
        this.codeMsg = '请输入验证码'
      } else if (!/^\d{6}$/.test(value)) {
        // 验证手机号的格式
        // 原生js中的方法test作用：判断value是否符合正则表达式
        this.codeMsg = '验证码6位数字'
      } else {
        // 验证通过
        this.codeMsg = ''
      }
    }, */
    // 实现登录功能
    async handleLogin () {
      try {
        /*  // 执行表单验证
        this.validateMobile()
        this.validateCode()
        if (this.mobileMsg || this.codeMsg) {
          // 表单验证没有通过，阻止后续代码的执行
          return
        } */
        // 调用接口前就行加载提示
        this.isLoading = true
        // 调用接口
        this.$router.push('/home')
        const ret = await login(this.mobile, this.code)
        if (ret.data.token && ret.data.refresh_token) {
          // 登录成功，缓存token信息,跳转到主页面
          sessionStorage.setItem('mytoken', JSON.stringify(ret.data))
          // 登录成功,跳转到home页面
          this.$toast.success('登录成功')
        } else {
          this.$toast('用户名或者密码错误')
          this.isLoading = false
        }
      } catch (e) {
        console.log(e)
        this.$toast.fail('用户名或验证码错误!😭')
        this.isLoading = false
      }
    }
  }
  // ----------------------测试接口代码-----------------------------------

  // async created () {
  // request({
  //   // method: 'get',
  //   url: 'http://test.zjie.wang/tab'
  // }).then(function (ret) {
  //   console.log(ret)
  // })
  //   const ret = await request({
  //     url: 'http://test.zjie.wang/tab'
  //   })
  //   console.log(ret)
  // }
}
</script>
<style scoped>
/* 登录按钮样式 */
.btn {
  margin: 0 auto;
  padding-top: 50px;
  width: 80%;
}
</style>
