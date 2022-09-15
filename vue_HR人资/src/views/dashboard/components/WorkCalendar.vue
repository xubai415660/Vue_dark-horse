<template>
  <div>
    <div class="select-box">
      <el-select v-model="currentYear" size="small" style="width: 120px; margin-right: 10px" @change="handleChange">
        <!-- 年份取给定年份的, 前五年 + 后五年 -->
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;" @change="handleChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <el-calendar v-model="currentDate">
      <!-- 日历组件插槽的名称不是default，而是dateCell -->
      <template v-slot:dateCell="scope">
        <div class="date-content">
          <span class="text">{{ scope.data.day | getDay }}</span>
          <!-- 只有周末加上【休】 -->
          <span v-if="isWeek(scope.date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  name: 'WorkCalendar',
  filters: {
    getDay (date) {
      // 2021-07-10
      // return date.substring(date.lastIndexOf('-') + 1)
      return date.split('-')[2]
    }
  },
  props: {
    date: {
      type: Date,
      default: () => new Date()
    }
  },
  data () {
    return {
      // 日历当前选中的年份
      currentYear: '',
      // 日历当前选中的月份
      currentMonth: '',
      // 当前日期
      currentDate: new Date()
    }
  },
  computed: {
    // 生成年份
    yearList () {
      // 生成一个年份列表
      const years = []
      // 获取当前的年份
      const year = new Date().getFullYear()
      // 当前年份前面添加5个后面添加5个
      for (let i = year - 5; i < year + 5; i++) {
        years.push(i)
      }
      return years
    }
  },
  watch: {
    // 侦听日历选中日期的变化
    currentDate (date) {
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
    }
  },
  created () {
    // 初始化当前的年和月
    this.currentYear = this.date.getFullYear()
    this.currentMonth = this.date.getMonth() + 1
  },
  methods: {
    // 监听下拉选框的变化
    handleChange () {
      // 把选框的当前日期赋值给日历的当前日期
      this.currentDate = new Date(this.currentYear + '-' + this.currentMonth)
    },
    // 判断日期是否为周末
    isWeek (date) {
      // 6表示周六，0表示周日
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>
<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}
</style>
<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-calendar-day {
  height: auto;
}
::v-deep
  .el-calendar-table__row
  td::v-deep
  .el-calendar-table
  tr
  td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  position: relative;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none;
}
</style>
