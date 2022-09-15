<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- 搜索框 -->
    <!-- trim的作用是去掉两侧的空格，类似于原生js中的字符串的trim方法 -->
    <van-search @search='handleSearch' @input='keywordList'
     v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想列表 -->
    <van-cell-group v-if="q" class="suggest-box">
      <van-cell @click='handleJump(item)'
      v-for="(item,index) in keylist" :key="index" icon="search">
        <p v-html="item"></p>
      </van-cell>
    </van-cell-group>
    <!-- 搜索历史 -->
    <div v-else-if='history.length' class="history-box">
      <div class="head">
        <span>历史记录</span>
        <van-icon @click='deleteAll' name="delete"></van-icon>
      </div>
      <van-cell-group>
          <van-cell @click='handleJump(item)' v-for='(item, index) in history' :key='index'>
          <a class="word_btn">{{item}}</a>
          <van-icon @click='deleteSingle(index)' class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import { searchList } from '@/api/search.js'

export default {
  name: 'Search',
  data () {
    return {
      // 搜索关键字
      q: '',
      // 历史关键字
      history: JSON.parse(window.localStorage.getItem('keywords') || '[]'),
      // 关键字列表
      keylist: [],
      // 函数防抖任务
      timer: null
    }
  },
  methods: {
    // 点击联想条目跳转
    handleJump (kw) {
      // kw此时包含span高亮的标签，需要去掉
      const reg = new RegExp(`<span>${this.q}</span>`, 'ig')
      kw = kw.replace(reg, this.q)
      // this.$router.push('/sresult?kw=' + kw)
      this.$router.push({
        path: 'sresult', query: { kw: kw }
      })
    },
    // 联想查询
    keywordList () {
      // 如下的写法就是函数防抖
      clearTimeout(this.timer)
      if (!this.q.trim()) return
      this.timer = setTimeout(async () => {
        const ret = await searchList(this.q)
        // 需求:让列表项内容与关键匹配后高亮（包裹一层span标签）
        this.keylist = ret.data.options.map(item => {
          // 原生js的方法replace用于替换整个字符串中的子串
          const reg = new RegExp(this.q, 'ig')
          return item.replace(reg, `<span>${this.q}</span>`)
        })
      }, 1000)
    },
    // 清楚历史关键词
    deleteAll () {
      // 清空数组
      this.history = []
      // 清空缓存
      window.localStorage.removeItem('keywords')
    },
    // 删除历史
    deleteSingle (index) {
      // 点击❌号删除对应的历史关键字
      this.history.splice(index, 1)
      // 删除缓存中的数据
      window.localStorage.setItem('keywords', JSON.stringify(this.history))
    },
    // 实现搜索功能
    handleSearch () {
      // 防止输入空字符串
      // q.trim()是原生js的方法，用于去掉两侧的空格 ''
      if (!this.q.trim()) return
      // 把搜索的历史关键字进行存储(把新输入的关键字放到前面)
      this.history.unshift(this.q)
      // set是Es6引入的一个构造函数，存储结构 和数组类似，其实不允许放重复的数据
      this.history = [...new Set(this.history)]
      //   把history数组放入缓存
      window.localStorage.setItem('keywords', JSON.stringify(this.history))
      // 跳转到搜索列表页面
      // this.$router.push('/sresult?kw=' + this.q)
      this.$router.push({
        path: 'sresult', query: { kw: this.q }
      })
    }
  },
  created () {
    console.log(this.$router)
  }
}
</script>
<style scoped lang="less">
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
