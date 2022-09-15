<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
    <!-- change事件表示：选中文件或者选中文件发生变化事触发 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx'
export default {
  name: 'Import',
  props: {
    beforeUpload: Function,      // eslint-disable-line
    onSuccess: Function          // eslint-disable-line
  },
  data () {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    // 获取Excel中解析的数据的结果
    generateData ({ header, results }) {
      // header表示表头
      // results表示员工列表数据
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      // 如果文件正在被解析，不允许再次选中文件
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('只支持上传一个文件！')
        return
      }
      const rawFile = files[0] // only use files[0]
      if (!this.isExcel(rawFile)) {
        this.$message.error('只支持上传 .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload () {
      // 通过程序触发file标签的点击操作
      this.$refs['excel-upload-input'].click()
    },
    handleClick (e) {
      // e.target.files表示选中的所有文件
      const files = e.target.files
      // 选中的唯一的Excel文件
      const rawFile = files[0] // only use files[0]
      // 如果没有选择文件，到这就结束了
      if (!rawFile) return
      // 选中之后，把文件传递给upload方法
      this.upload(rawFile)
    },
    upload (rawFile) {
      // 可以重新选择同一个文件
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      // 如果this.beforeUpload不存在，就执行该分支
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      // 如果this.beforeUpload存在，就执行该分支
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 该方法负责解析Excel中的数据
    readerData (rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // FileReader 负责读取Excel文件的内容
        const reader = new FileReader()
        // 读取Excel文件成功后，触发onload方法
        reader.onload = e => {
          // data表示读取到的Excel中的原始数据
          const data = e.target.result
          // 这个原始的data数据需要通过第三方包XLSX提供的方法进行解析
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow (sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel (file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>
<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
