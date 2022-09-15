<template>
  <div class="employees-container">
    <!-- 顶部的菜单 -->
    <page-tools>
      <template #left>
        <span>本月：公积金提交日期有变更</span>
      </template>
      <template #right>
        <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
        <el-button size="mini" type="primary" @click="handleExport">导出</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="showDialog=true">新增员工</el-button>
      </template>
    </page-tools>
    <!-- 员工列表 -->
    <el-card style="margin-top: 10px;">
      <el-table border :data="list">
        <el-table-column :index="handleIndex" label="序号" type="index" sortable="" />
        <el-table-column label="头像" prop="staffPhoto" sortable="">
          <template v-slot="scope">
            <!-- 如果正常加载的图片失败了，默认显示error中的图片 -->
            <el-image class="staff" :src="scope.row.staffPhoto" @click="previewImg(scope.row.staffPhoto)">
              <div slot="error">
                <img class="staff" :src="defaultImage">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" :formatter="formatHireType" />
        <!-- <el-table-column label="聘用形式" prop="formOfEmployment" sortable="">
          <template v-slot="scope">
            {{ formatHireType(scope.row.formOfEmployment) }}
          </template>
        </el-table-column> -->
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template v-slot="scope">
            {{ scope.timeOfEntry | formatData }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template v-slot="scope">
            <el-switch :value="scope.row.enableState===1" active-color="#13ce66" inactive-color="#ff4949" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${scope.row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="assignRole(scope.row.id)">角色</el-button>
            <el-button type="text" size="small" @click="hanleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div style="height: 60px; margin-top: 10px">
        <el-pagination :total="total" :page-size="filterParams.size" :current-page="filterParams.page" layout="prev, pager, next, jumper, slot" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 添加员工 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 预览的二维码的弹层 -->
    <el-dialog width="300px" title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <!-- canvas画布用于绘制二维码 -->
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <assign-role :user-id="userId" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>
<script>
import { reqGetEmployeeList, reqDelEmployee } from '@/api/employees.js'
import AddEmployee from './components/AddEmployee'
import Types from '@/api/constant/employees.js'
import AssignRole from './components/AssignRole.vue'
import moment from 'moment'
import QrCode from 'qrcode'

export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
  },
  data () {
    return {
      // 分配加角色的用户id
      userId: '',
      // 控制分配角色的弹窗
      showRoleDialog: false,
      // 二维码弹窗标志位
      showCodeDialog: false,
      // 默认显示的图片
      defaultImage: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146034403,1504718527&fm=26&gp=0.jpg',
      // 控制添加员工弹窗
      showDialog: false,
      // 查询参数
      filterParams: {
        // 页码
        page: 1,
        // 每页的条数，
        size: 10
      },
      // 员工总数(列表总数)
      total: 0,
      // 员工列表数据
      list: []
    }
  },
  created () {
    this.loadEmployeeList()
  },
  methods: {
    // 给用户分配角色
    assignRole (id) {
      // 显示弹窗
      this.showRoleDialog = true
      this.userId = id
      console.log(id)
    },
    // 实现图片预览功能（二维码 ）
    previewImg (url) {
      if (!url) return
      // 显示弹窗
      this.showCodeDialog = true
      // 把url转换为二维码并绘制到canvas画布中
      // 注意：这里无法直接获取this.$refs.myCanvas元素的
      this.$nextTick(() => {
        // 如果这里url写的是网址，就会跳转到对应的网址（二维码分享效果）
        QrCode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    // 把json数据转换为二维数组
    jsonToArray (headers, jsonData) {
      // Object.keys方法的作用：获取对象的所有的key，形成一个数组
      // 获取导入员工Excel的标题数据
      const header = Object.keys(headers)
      // 员工数据
      const results = []
      jsonData.forEach(item => {
        // 一行数据
        const row = []
        header.forEach(title => {
          // 根据title获取对应的数据值
          // 根据title的中文信息获取对应的英文信息
          const attrName = headers[title] // username
          // 根据英文的属性名称获取相应的值
          let attrValue = item[attrName] // 王果果
          // 判断时间相关信息
          if (['timeOfEntry', 'correctionTime'].includes(attrName)) {
            // 处理时间
            try {
              attrValue = moment(attrValue).format('yyyy-MM-DD')
            } catch (e) {
              console.log(e)
            }
          } else if (attrName === 'formOfEmployment') {
            // 聘用形式
            const info = Types.hireType.find(item => {
              return item.id === parseInt(attrValue)
            })
            attrValue = info ? info.value : attrValue
          }
          // 把对应的值放入第二维数组
          row.push(attrValue)
        })
        // 生成一个员工的数据
        results.push(row)
      })
      return results
    },
    // 获取需要导出的数据
    async getExportData (headers) {
      try {
        // 从后端查询所有的数据
        const ret = await reqGetEmployeeList({
          page: 1,
          size: this.total
        })
        if (ret.code === 10000) {
          // 把json数据转换为二维数组
          return this.jsonToArray(headers, ret.data.rows)
        } else {
          return []
        }
      } catch {
        return []
      }
    },
    // 实现导出Excel功能
    handleExport () {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取员工列表数据（已经是二维数组）
        const list = await this.getExportData(headers)
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: list,
          // data: [
          //   ['刘备', 100],
          //   ['关羽', 500]
          // ], // 具体数据 必填
          filename: 'excel-list', // 非必填,导出的文件名称
          autoWidth: true, // 非必填，控制内容自适应宽度
          bookType: 'xlsx' // 非必填，导出的文件后缀
        })
      })
    },
    // 动态计算累加的索引-----------序号---------
    handleIndex (index) {
      // 形参index表示列表数据的索引，从0开始
      // （当前页码-1） * 每页的条数
      const { page, size } = this.filterParams
      return (page - 1) * size + index + 1
    },
    // 删除员工
    hanleDelete (id) {
      // 删除部门
      this.$confirm('确认要删除员工吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ret = await reqDelEmployee(id)
        if (ret.code === 10000) {
          // 删除成功，刷新列表
          this.loadEmployeeList()
        } else {
          this.$message.error(ret.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$message.error('删除员工失败！')
        }
      })
    },
    // 格式化聘用格式
    formatHireType (row) {
      // find的返回值是其中一项数据
      const obj = Types.hireType.find(item => {
        return item.id === row.formOfEmployment
      })
      return obj ? obj.value : row.formOfEmployment
    },
    // 基于过滤器方式实现---格式化聘用格式
    // formatHireType (type) {
    //   // 格式化聘用形式
    //   const obj = Types.hireType.find(item => {
    //     return item.id === type
    //   })
    //   return obj ? obj.value : type
    // },

    // --------------分页--------------------
    handleCurrentChange (index) {
      // 页码变化时自动触发
      this.filterParams.page = index
      // 更新成功，刷新列表
      this.loadEmployeeList()
    },
    // 获取员工列表数据
    async loadEmployeeList () {
      try {
        const ret = await reqGetEmployeeList(this.filterParams)
        if (ret.code === 10000) {
          this.list = ret.data.rows
          this.total = ret.data.total
        } else {
          this.$message.error(ret.message)
        }
      } catch {
        this.$message.error('获取员工列表失败!')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.employees-container {
  .staff {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
}
</style>
