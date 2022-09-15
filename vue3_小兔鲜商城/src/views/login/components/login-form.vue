<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="changeLogin(false)" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="changeLogin(true)" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref='target' class="form" v-slot='{ errors }'>
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model='form.account' autocomplete='off' type="text" name='account' :rules='schema.account' placeholder="请输入用户名或手机号" />
          </div>
          <div class="error" v-if='errors.account'><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field v-model='form.password' autocomplete='off' type="password" name='password' :rules='schema.password' placeholder="请输入密码" />
          </div>
          <div class="error" v-if='errors.password'><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model='form.mobile' autocomplete='off' type="text" name='mobile' :rules='schema.mobile' placeholder="请输入手机号" />
          </div>
          <div class="error" v-if='errors.mobile'><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field v-model='form.code' autocomplete='off' type="password" name='code' :rules='schema.code' placeholder="请输入验证码" />
            <span @click='sendCode' class="code">{{timer===0?'发送验证码':timer+'秒后发送'}}</span>
          </div>
          <div class="error" v-if='errors.code'><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- 通过Field组件的as属性值可以指定最终渲染为什么元素（支持组件） -->
          <Field as='XtxCheckbox' name='isAgree' :rules='schema.isAgree' v-model="form.isAgree" />
          <!-- <XtxCheckbox v-model="form.isAgree" /> -->
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if='errors.isAgree'><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click='handleLogin' href="javascript:;" class="btn">登录</a>
      <!-- <XtxMessage type='error' text='登录失败' /> -->
    </Form>
    <div class="action">
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from 'vue'
import { Field, Form } from 'vee-validate'
import schema from '@/utils/vee-validate-schema.js'
import Message from '@/components/library/Message.js'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'

export default {
  name: 'LoginForm',
  components: { Field, Form },
  setup () {
    // onMounted(() => {
    //   // 组件渲染完毕，使用QC生成QQ登录按钮
    //   window.QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })
    // router实例
    const router = useRouter()
    // store实例
    const store = useStore()
    // DOM操作
    const target = ref(null)
    // 登录方式标志位
    const isMsgLogin = ref(false)
    // 表单数据
    const form = reactive({
      // 用户名
      account: null,
      // 密码
      password: null,
      // 手机号
      mobile: null,
      // 验证码
      code: null,
      // 是否同意
      isAgree: false
    })

    // 控制登录方式的切换
    const changeLogin = (type) => {
      // 切换登录表单
      isMsgLogin.value = type
      // 清空之前的表单数据
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 调用Form组件的实例方法resetForm重置表单
      // resetForm不可以重置表单数据，但是可以重置错误提示
      target.value.resetForm()
    }

    // 触发登录
    const handleLogin = async () => {
      const flag = await target.value.validate()
      if (flag) {
        try {
          // 判断登录方式
          let ret = null
          if (isMsgLogin.value) {
            // 手机登录
            ret = await userMobileLogin({ mobile: form.mobile, code: form.code })
          } else {
            // 账号登录
            ret = await userAccountLogin({ account: form.account, password: form.password })
          }
          if (ret.result) {
            // 登录成功
            const { result: { id, avatar, nickname, account, mobile, token } } = ret
            // 保存用户信息
            store.commit('user/updateUserInfo', { id, avatar, nickname, account, mobile, token })
            // 跳转到主页面
            router.push('/')
          } else {
            Message({ type: 'error', text: '登录失败' })
          }
        } catch (e) {
          // 处理接口调用的状态码的错误
          Message({ type: 'error', text: e.response.data.message || '登录失败' })
        }
      }
    }
    // 倒计时
    const timer = ref(0)
    // 发送验证码倒计时
    // useIntervalFn(定时的回调，回调的时间间隔，控制回调的调用方式)
    // 参数三 {immediate: true, immediateCallback: false}
    // 3-1) immediate 立刻开启定时任务（默认值true表示默认开启）
    // 3-2）immediateCallback 执行useIntervalFn函数立刻执行回调（在延时时间的前或者后调用）
    // pause暂停；resume启动
    const { pause, resume } = useIntervalFn(() => {
      if (timer.value <= 0) {
        // 停止定时任务
        pause()
      } else {
        // 单次定时任务执行的回调
        timer.value--
      }
    }, 1000, {
      // 默认不开启定时任务
      immediate: false
    })
    // 发送验证码操作
    const sendCode = async () => {
      // 手动操作手机号验证
      const msg = schema.mobile(form.mobile)
      // 判断手机号是否正确
      if (msg === true) {
        // 手机号格式正确,调用接口发送验证码
        try {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '获取验证码成功' })
          // 验证码如果已经发送过了，显示按钮的倒计时效果
          timer.value = 60
          // 开始倒计时
          resume()
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '获取验证码失败' })
        }
      } else {
        // 手机号格式错误,设置错误提示
        // vee提供了一个方法专门用于显示错误提示 setFieldError
        target.value.setFieldError('mobile', msg)
      }
    }

    return { timer, form, isMsgLogin, schema, target, changeLogin, handleLogin, sendCode }
  }
  // mounted () {
  //   this.$message({ type: 'error', text: '登录失败' })
  // }
}
</script>
<style scoped lang='less'>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
