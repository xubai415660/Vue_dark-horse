<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <!-- 放置标题图片 @是设置的src目录别名-->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-button class="login-btn" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <!-- 底部信息 -->
      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
// import { login } from '@/api/user.js'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    // 自定义表单验证规则：验证用户名上是否正确
    // 自定义校验函数
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名称😘'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码的长度不可以小于6位数🔐'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '13800000002',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password'
      // redirect: undefined
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // ------------------------优化登录代码-----------------------------------
    // 把Action映射为函数
    ...mapActions('user', ['login']),
    handleLogin () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 表单验证通过，触发action
          const ret = await this.login({
            mobile: this.loginForm.username,
            password: this.loginForm.password
          })
          this.$message('登录成功')
          if (ret) {
            // 登录成功，跳转到主页面
            return this.$router.push('/')
          }
          // 基于ElementUI提供的提示功能
          this.$message.error('用户名或者密码错误')
        }
      })
    }
    // -----------------封装一个Action方法实现登录---------------------
    /* handleLogin () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 表单验证通过，触发action
          this.$store.dispatch('user/login', {
            mobile: this.loginForm.username,
            password: this.loginForm.password
          }).then(ret => {
            if (ret) {
              // 登录成功，跳转到主页面
              this.$router.push('/')
              this.$message('登录成功')
            } else {
              this.$message.error('登录失败')
            }
          })
        }
      })
    } */
    // -----------------------登录基本功能------------------------------------
    // handleLogin () {
    //   // 点击登录按钮时，触发表单验证
    //   // validate函数属于谁？el-form组件的实例对象
    //   this.$refs.loginForm.validate(async valid => {
    //     if (valid) {
    //       // 调用接口实现登录
    //       try {
    //         const ret = await login({
    //           mobile: this.loginForm.username,
    //           password: this.loginForm.password
    //         })
    //         if (ret.data.code === 10000) {
    //           // 登录成功，跳转到主页面,缓存token
    //           sessionStorage.setItem('mytoken', ret.data.data)
    //           this.$router.push('/')
    //         } else {
    //           this.$message.error('登录失败')
    //         }
    //       } catch {
    //         // 登录失败
    //         this.$message.error('登录失败')
    //       }
    //     } else {
    //       console.log('表单验证失败')
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
// 修改输入框字体颜色
$light_gray: #fe7c40;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // 设置背景图片
  background-image: url('~@/assets/common/login.jpg');
  // 将图片位置设置为充满整个屏幕
  background-position: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

 .el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.9); // 输入登录表单的背景色
  border-radius: 5px;
  color: #454545;
  }
  //设置错误信息的颜色
  .el-form-item__error { color: #fff; font-size: 14px; }

}
// 设置登录按钮的样式
.login-btn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
