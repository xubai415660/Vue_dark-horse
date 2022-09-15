<template>
  <upload-excel :on-success="onSuccess" :before-upload="beforeUpload" />
</template>

<script>
import { reqImportEmployee } from '@/api/employees.js'

export default {
  name: 'Import',
  methods: {
    // 上传文件之前执行该函数
    beforeUpload (file) {
      // 参数file其实就是选中的文件
      if (file.name.endsWith('.xlsx')) {
        // 选中的文件是Excel格式
        return true
      } else {
        this.$message.error('仅仅支持Excel文件')
        return false
      }
    },
    // 把Excel读取的数据转换为接口需要的数据
    translateData (data) {
      // data表示读取到的Excel中的最终数据
      // 中文和属性的映射关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 基于data中的数据定制接口需要的数据格式
      // results = [{"手机号":15751786628,"姓名":"张飞1","入职日期":43535,"转正日期":43719,"工号":88088},{"手机号":15751786630,"姓名":"关羽2","入职日期":43535,"转正日期":43719,"工号":88089}]
      // 需要把results数据中的中文替换为英文（接口需要）
      const persons = []
      data.results.forEach(person => {
        const row = {}
        for (const key in person) {
          // 对象中的key是一个动态的变量
          // 把每一个属性都更换为英文的
          const name = userRelations[key]
          const value = person[key]
          // row[name] = value
          if (['timeOfEntry', 'correctionTime'].includes(name)) {
            // 这个属性是时间，需要把数字转换为 年月日格式
            row[name] = this.formatDate(value)
          } else {
            // 非日期格式不做处理
            row[name] = value
          }
        }
        persons.push(row)
      })
      return persons
    },
    // 转换日期格式
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return (
          year +
          format +
          (month < 10 ? '0' + month : month) +
          format +
          (date < 10 ? '0' + date : date)
        )
      }
      return (year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date))
    },
    // 导入Excel数据成功回调函数
    async onSuccess (data) {
      try {
        const results = this.translateData(data)
        console.log(results)
        const ret = await reqImportEmployee(results)
        if (ret.code === 10000) {
          // 导入成功，跳转到列表页面
          this.$router.push('/employees')
        } else {
          this.$message.error(ret.message)
        }
      } catch {
        this.$message.error('导入员工失败！')
      }
    }
  }
}
</script>

<style></style>
