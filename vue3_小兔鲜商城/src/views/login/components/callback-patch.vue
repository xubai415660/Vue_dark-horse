<template>
  <Form ref='target' class="xtx-form" v-slot='{ errors }'>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field v-model="form.account" name='account' :rules='schema.accountApi' class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div class="error" v-if='errors.account'>{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name='mobile' :rules='schema.mobile' class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div class="error" v-if='errors.mobile'>{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field v-model="form.code" name='code' :rules='schema.code' class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click='sendCode'>{{timer===0?'发送验证码':timer+'秒后发送'}}</span>
      </div>
      <div class="error" v-if='errors.code'>{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.password" name='password' :rules='schema.password' class="input" type="password" placeholder="请输入密码" />
      </div>
      <div class="error" v-if='errors.password'>{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.rePassword" name='rePassword' :rules='schema.rePassword' class="input" type="password" placeholder="请确认密码" />
      </div>
      <div class="error" v-if='errors.rePassword'>{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click='handleSubmit'>立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema.js'
import { reactive, ref } from 'vue'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user.js'
import Message from '@/components/library/Message.js'
import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      required: true
    }
  },
  components: { Form, Field },
  setup (props) {
    console.log(props.unionId, '---------------------')
    const store = useStore()
    const router = useRouter()
    // 表单数据
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 表单ref操作
    const target = ref(null)
    // 定时任务
    const timer = ref(0)
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
          await userQQPatchCode(form.mobile)
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
    // 注册提交表单
    const handleSubmit = async () => {
      // 手动进行表单验证
      const flag = await target.value.validate()
      if (flag) {
        try {
          // 表单验证通过,获取返回的用户信息
          const ret = await userQQPatchLogin(props.unionId, form)
          const { id, account, avatar, mobile, nickname, token } = ret.result
          // 把用户信息放到vuex中
          store.commit('user/updateUserInfo', { id, account, avatar, mobile, nickname, token })
          // 提示成功
          Message({ type: 'success', text: '完善用户信息成功' })
          // 跳转到首页
          router.push('/')
        } catch {
          Message({ type: 'error', text: '完善用户信息失败' })
        }
      }
    }
    return { form, schema, sendCode, target, timer, handleSubmit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
