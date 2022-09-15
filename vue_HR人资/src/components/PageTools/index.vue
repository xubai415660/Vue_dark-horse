<template>
  <el-card>
    <div class="page-tools">
      <!-- 左侧 -->
      <div class="left">
        <div class="tips">
          <slot name="left">
            <i class="el-icon-info" />
            <span>默认提示</span>
          </slot>
        </div>
        <!-- $slots表示父组件传递过来的所有的插槽信息 -->
        <!-- <div v-if="$slots.left" class="tips">
          <i class="el-icon-info" />
          <slot name="left" />
        </div> -->
      </div>
      <div class="right">
        <!-- 右侧 -->
        <slot name="right" />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
