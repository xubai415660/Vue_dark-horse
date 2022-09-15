<template>
<div>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 如果已经登录并且绑定手机号，那么直接登录即可，登录的过程显示加载状态 -->
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <!-- 显示绑定手机号的表单布局 -->
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId='unionId' />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId='unionId' />
    </div>
  </section>
  <LoginFooter />
</div>
</template>
<script>
import LoginHeader from './components/login-header.vue'
import LoginFooter from './components/login-footer.vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import { ref } from 'vue'
import { userQQLogin } from '@/api/user.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message.js'

export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    const store = useStore()
    const router = useRouter()
    const hasAccount = ref(true)
    const isBind = ref(true)
    const unionId = ref('')
    // 1、已经注册了小兔鲜账号，并且已经绑定了手机号，直接调用接口进行登录
    // 接口参数：1）unionId(openId)由QQ提供（已经授权登录）；2）source表示平台标识
    // 获取unionId操作：基于QQ提供的SDK相关的方法获取
    if (window.QC.Login.check()) {
      // QC.Login.check()方法的作用：判断是否已经QQ授权登录，返回值true表示已经授权登录
      window.QC.Login.getMe(async openId => {
        try {
          // 记录unionId方便传递绑定手机号的组件
          unionId.value = openId
          // 调用接口实现登录
          const ret = await userQQLogin(openId, 1)
          const { id, account, avatar, mobile, nickname, token } = ret.result
          // 把用户登录成功的信息存储vuex中
          store.commit('user/updateUserInfo', { id, account, avatar, mobile, nickname, token })
          // 提示QQ登录成功
          Message({ type: 'success', text: 'QQ登录成功' })
          // 同步购物车数据到服务器
          store.dispatch('cart/mergeLocalCart').then(() => {
            Message({ type: 'success', text: '购物车同步成功' })
          }).catch(() => {
            Message({ type: 'error', text: '购物车同步失败' })
          })
          // 跳转到主页面
          router.push('/')
        } catch {
          // 登录失败，隐藏加载状态，进行提示
          isBind.value = false
          Message({ type: 'error', text: 'QQ登录失败' })
        }
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>
<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
