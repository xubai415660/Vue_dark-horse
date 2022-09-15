<template>
  <Form class="xtx-form" v-slot='{ errors }'>
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field name='mobile' v-model='form.mobile' :rules='schema.mobile' class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if='errors.mobile'>{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field name='code' v-model='form.code' :rules='schema.code' class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click='sendCode'>发送验证码</span>
      </div>
      <div class="error" v-if='errors.code'>{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click='handleSubmit'>立即绑定</a>
  </Form>
</template>

<script>
import { ref, reactive } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema.js'
import Message from '@/components/library/Message.js'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '@/api/user.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    // 获取用户的头像信息
    const nickname = ref('')
    const avatar = ref('')

    // 表单数据
    const form = reactive({
      mobile: null,
      code: null
    })

    // 基于QQ提供的SDK方法获取用户的头像和昵称
    if (window.QC.Login.check()) {
      // 已经授权登录，此时可以获取QQ账号的头像和昵称
      window.QC.api('get_user_info').success(ret => {
        nickname.value = ret.data.nickname
        avatar.value = ret.data.figureurl_1
      })
    }

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
          await userQQBindCode(form.mobile)
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
    // 绑定手机号提交表单
    const handleSubmit = async () => {
      try {
        const ret = await userQQBindLogin(props.unionId, form.mobile, form.code)
        const { id, account, avatar, mobile, nickname, token } = ret.result
        // 存储用户信息到vuex
        store.commit('user/updateUserInfo', { id, account, avatar, mobile, nickname, token })
        // 成功提示
        Message({ type: 'success', text: '绑定手机号成功' })
        // 跳转到首页
        router.push('/')
      } catch (e) {
        Message({ type: 'error', text: e.response.data.message || '获取验证码失败' })
      }
    }
    return { nickname, avatar, schema, form, sendCode, handleSubmit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
