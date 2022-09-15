<template>
  <div class="navbar">
    <!-- 控制左侧菜单展开和折叠的汉堡图标 -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!--  头部名称-->
    <div class="app-breadcrumb">
      {{ $t('navbar.title') }}
      <span class="breadBtn">正式版</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 右侧下拉菜单 -->
    <div class="right-menu">
      <!-- 切换语言环境 -->
      <lang-change class="right-menu-item" />
      <!-- 全屏控制组件 -->
      <screen-full class="right-menu-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 用户头像 -->
          <img v-imgerror="defaultImg" :src="avatar" class="user-avatar">
          <!-- 用户名称 -->
          <span class="name">{{ uname }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://xxx.com">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- 在组件的标签上绑定时间时，如果添加.native修饰符，表示把时间绑定到组件的根元素上 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import { getInfo } from '@/api/user.js'
// 处理头像失效
import Img from '@/assets/common/head.jpg'
import { resetRouter } from '@/router/index.js'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data () {
    return {
      // defaultImg: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2344451607,2404623174&fm=111&gp=0.jpg'
      defaultImg: Img
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'uname'
    ])
  },
  async created () {
    // action中返回的id，可以通过await获取到（action的返回值本质上是Promise）
    // await是必要的：上一个接口得到结果后，作为下一个接口调用的参数
    // const id = await this.getInfo()
    // this.getDetailInfo(id)
    // this.$store.dispatch('user/getInfo')
    this.getInfo()
  },
  methods: {
    ...mapMutations('user', ['updateUserInfo', 'removeToken']),
    ...mapActions('user', ['getInfo']),
    // 控制菜单的展开和折叠
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出功能
    async logout () {
      // 点击退出时需要提示是否退出
      this.$confirm('确定退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 点击确定，执行then方法
      }).then(() => {
        // 删除token,删除用户信息
        // this.removeToken()
        // this.updateUserInfo()
        // 1、清空token
        this.$store.commit('user/removeToken')
        // 2、清空用户信息
        this.$store.commit('user/updateUserInfo', null)
        // 3、重置路由为静态路由
        resetRouter()
        // 4、清除vuex中动态路由
        this.$store.commit('permission/updateRoutes', [])
        // 5、跳转到登录页面
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        // 点击取消，执行catch方法
        console.log('取消')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      // vertical-align: text-bottom;
      vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          cursor: pointer;
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
