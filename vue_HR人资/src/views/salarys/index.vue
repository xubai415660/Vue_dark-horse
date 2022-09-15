<template>
  <div>
    <el-row :gutter="10">
      <el-col
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="1"
      ><div
        class="grid-content bg-purple"
      /></el-col>
      <el-col
        :xs="4"
        :sm="6"
        :md="8"
        :lg="9"
        :xl="11"
      ><el-input
        v-model="input"
        placeholder="请输入内容"
        :style="box"
        class="my"
      />
      </el-col>
      <el-col
        :xs="4"
        :sm="6"
        :md="8"
        :lg="9"
        :xl="11"
      ><div
        class="grid-content bg-purple"
      /></el-col>
      <el-col
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="1"
      ><div
        class="grid-content bg-purple-light"
      /></el-col>
    </el-row>
    <!-- <div class="aaa">
      <el-button>默认按钮</el-button>
      <el-button>默认按钮</el-button>
    </div> -->
<el-row :gutter="20">
  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
</el-row>

  </div>
</template>
<script>
export default {
  data () {
    return {
      input: '',
      box:{
        
      }
    }
  }
}
</script>
<style scoped>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.my >>> .el-input__inner {
  border-radius: 30px; /* 这些起作用 */
  border: 1px solid #eceef2;
  outline: 0;
  width: 100px;
  background-color: pink;
}
.aaa {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  text-align: center;
  line-height: 100px;
  background-color: pink;
}
</style>
