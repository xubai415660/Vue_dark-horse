<template>
  <div class="my-img-upload">
    <!-- 自动上传：选中图片后，自动把图片文件传递给action指向的url地址 -->
    <!-- 手动上传：选中图片后，仅仅触发一个函数，该函数中需要自己写代码上传 -->
    <el-upload
      ref="upload"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :class="{'hide-plus': imgLen}"
      list-type="picture-card"
      :limit="limit"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :auto-upload="true"
      :http-request="handleUpload"
    >
      <!-- 默认情况下，选中的文件直接会上传到action指向的url地址，我们不需要它自动上传，需要做到手动上传-->
      <!-- list-type 表示预览的布局形式 -->
      <!-- limit表示允许上传的文件个数 -->
      <!-- action 表示默认上传的图片地址 -->
      <!-- file-list 表示显示的图片列表 -->
      <!-- on-preview控制图片预览效果 -->
      <!-- auto-upload控制是否自动上传 -->
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 图片预览层 -->
    <el-dialog width="600px" top="8vh" title="图片预览" :visible.sync="showDialog">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
    <!-- <button @click="handleClick">点击上传</button> -->
    <!-- 进度条组件 -->
    <div v-if="isShow">上传进度：
      <el-progress style="width: 180px;" :percentage="percent" />
    </div>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 导入腾讯云的包(sdk)
const cos = new COS({
  SecretId: 'AKIDe8LHxOcZHhqjLglZ6OREk0zra5MOAhyy', // 身份识别ID
  SecretKey: 'lFUUDfqqa8PQAdokPnulLegRwA8qITN0' // 身份秘钥
})

export default {
  name: 'ImageUpload',
  props: {
    limit: {
      type: Number,
      required: true
    },
    defaultImg: {
      type: String,
      required: true,
      null: ''
    }
  },
  data () {
    return {
      // 进度条的百分比
      percent: 0,
      // 控制进度条显示
      isShow: false,
      // 控制预览弹窗效果
      showDialog: false,
      // 预览图片
      imgUrl: '',
      // 默认的图片列表地址
      fileList: [
        // { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ]
    }
  },
  computed: {
  // 设定一个计算属性 判断是否已经上传完了一张
    imgLen () {
      return this.fileList.length >= this.limit
    },
    // 判断是否所有的图片都上传成功了
    isAllSuccess () {
      return this.fileList.every(item => {
        return item.status === 'success'
      })
    }
  },
  watch: {
    defaultImg (src) {
      this.fileList = [{ url: this.defaultImg }]
    }
  },
  // updated () {
  //   console.log(this.defaultImg)
  //   this.fileList = [{ url: this.defaultImg }]
  // },
  // created () {
  //   this.fileList = [{ url: this.defaultImg }]
  // },
  methods: {
    // 上传之前检测文件的合法性
    beforeUpload (file) {
      // file表示选中的文件信息
      // 1.验证文件的类型
      const types = ['image/png', 'image/jpeg', 'image/gif']
      if (!types.includes(file.type)) {
        // 不在规定的范围中（支持该文件类型）
        this.$message.error('文件类型错误！')
        return false
      }
      // 2.检测文件的大小（限制1M以内）
      if (file.size / 1024 / 1024 > 1) {
        this.$message.error('文件不可以超过1M')
        return false
      }
      return true
    },
    handleClick () {
      // 触发上传的动作
      this.$refs.upload.submit()
    },
    // 把选中的文件上传到腾讯云服务器
    handleUpload (params) {
      if (!params.file) return
      // 将文件对象，上传到腾讯云
      cos.putObject({
        Bucket: 'wh-1306446112', // 存储桶
        Region: 'ap-beijing', // 存储桶所在地域，必须字段
        Key: params.file.name, // 文件名
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: params.file, // 上传文件对象
        // 监控上传的进度
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData))
          // 开始上传，显示进度条
          this.isShow = true
          this.percent = progressData.percent * 100
          if (progressData.percent === 1) {
            // 进度完成,最后上传完，延迟1500毫秒关闭
            setTimeout(() => {
              this.isShow = false
              this.percent = 0
            }, 1500)
          }
        }
      }, (err, data) => {
        // 判断是否有异常
        if (err) {
          return this.$message.error('上传图片失败')
        }
        // data表示上传成功后后端返回的数据
        // 上传成功后需要把对应的图片的地址修改为腾讯云上传成功的地址，并且修改完成状态
        // 选中图片后，this.fileList中本来已经有了选中的这张图片的信息
        const currentImg = this.fileList.find(item => {
          return item.uid === params.file.uid
        })
        currentImg.status = 'success'
        currentImg.url = 'https://' + data.Location
      })
    },
    // 添加文件，用户选中了就应该新增文件预览（选中图片后，该函数会触发）
    handleChange (file, fileList) {
      // file 表示新选中的文件
      // fileList 表示选中之后剩余的列表
      this.fileList = fileList
    },
    // 控制删除动作
    handleRemove (file, fileList) {
      // file表示当前删除的图片信息
      // fileList表示删除后剩余的图片信息
      this.fileList = fileList
    },
    preview (file) {
      // 点击缩略图的预览效果
      this.imgUrl = file.url
      // 控制弹窗的显示
      this.showDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
.hide-plus {
  ::v-deep {
    .el-upload--picture-card {
      display: none
    }
  }
}
</style>
