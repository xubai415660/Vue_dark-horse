<template>
  <div ref="mychart" class="mychart">图表</div>
</template>
<script>
// import * as echarts from 'echarts'
// 按需导入，性能更好（打包代码体积更小）
import * as echarts from 'echarts/core' // 引入主模块
import { RadarChart } from 'echarts/charts' // 引入雷达图
// 引入提示框和标题组件
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
// 引入canvas渲染器
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([LegendComponent, TitleComponent, TooltipComponent, RadarChart, CanvasRenderer])

export default {
  name: 'WorkChart',
  mounted () {
    this.initChart()
  },
  methods: {
    // 初始化图表
    initChart () {
      // echarts.init方法的作用：生成一个echarts实例对象，并且指定渲染的位置
      const myChart = echarts.init(this.$refs.mychart)
      const option = {
        title: {
          text: '基础雷达图'
        },
        tooltip: {},
        legend: {
          data: ['平均水平', '个人价值']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [
          {
            name: '平均 vs 个人',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [
              {
                value: [80, 80, 80, 80, 80, 80],
                name: '平均水平'
              },
              {
                value: [90, 75, 95, 90, 95, 90],
                name: '个人价值'
              }
            ]
          }
        ]
      }
      // 配置图表的选项：控制图表绘制成什么风格
      myChart.setOption(option)
    }
  }
}
</script>
<style scoped lang="scss">
.mychart {
  width: 600px;
  height: 400px;
}
</style>
