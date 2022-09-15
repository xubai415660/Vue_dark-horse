module.exports = {
  plugins: {
    // 控制样式属性前面自动添加前缀
    autoprefixer: {},
    'postcss-pxtorem': {
      // html的font-size规定为37.5px
      // 为什么是37.5？因为iPhone6的尺寸是375px
      // 现在的主流设计稿是那个手机的尺寸？iphone6
    //   rootValue: 37.5,
      rootValue ({ file }) {
        // file参数表示Vant组件库样式文件的路径 import 'vant/lib/index.css'
        // vant设计稿是375px
        // 标准的设计稿应该是750px
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 控制那些样式的属性需要转换
      propList: ['*']
    }
  }
}
