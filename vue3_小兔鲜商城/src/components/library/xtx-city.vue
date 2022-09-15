<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click='toggle'>
      <span class="placeholder" v-if='!fullLocation'>请选择配送地址</span>
      <span class="value" v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show='isShow'>
      <div v-if='loading' class='loading'></div>
      <template v-else>
        <!-- v-for不建议配置v-if指令一块用 -->
        <span @click='changeCity(city)' class="ellipsis" v-for="city in cityList" :key="city.code">{{city.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed } from 'vue'
import { getCityList } from '@/api/product.js'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 弹窗引用对象
    const target = ref(null)
    onClickOutside(target, () => {
      // 点击弹窗之外的区域自动触发
      isShow.value = false
    })
    // 选中的省市区
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 控制城市的切换
    const changeCity = (city) => {
      if (city.level === 0) {
        // 省级
        changeResult.provinceCode = city.code
        changeResult.provinceName = city.name
      } else if (city.level === 1) {
        // 市级
        changeResult.cityCode = city.code
        changeResult.cityName = city.name
      } else if (city.level === 2) {
        // 县级
        changeResult.countyCode = city.code
        changeResult.countyName = city.name
        // 关闭弹窗
        toggle()
        // 把选中的数据交给父组件
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        emit('change-result', changeResult)
      }
    }
    // 动态计算当前显示的是省级还是市级还是县级
    const cityList = computed(() => {
      // 省级列表
      let result = list.value
      // 计算市级列表
      if (changeResult.provinceCode && changeResult.provinceName) {
        // 点击了省，计算它的市级数据
        result = result.find(item => item.code === changeResult.provinceCode).areaList
      }
      // 计算县级列表
      if (changeResult.cityCode && changeResult.cityName) {
        // 点击了省，计算它的市级数据
        return result.find(item => item.code === changeResult.cityCode).areaList
      }
      return result
    })
    // 控制数据加载的状态位
    const loading = ref(false)
    // 城市列表数据
    const list = ref([])
    // 显示隐藏状态位
    const isShow = ref(false)
    // 控制选择城市弹窗的显示和隐藏
    const toggle = () => {
      isShow.value = !isShow.value
      // 打开弹窗是调用接口获取城市列表数据
      if (isShow.value) {
        loading.value = true
        getCityList().then(data => {
          list.value = data
          loading.value = false
        })
        // 打开弹窗时，请求数据
        for (const key in changeResult) {
          changeResult[key] = ''
        }
      }
    }
    return { isShow, toggle, cityList, loading, changeCity, target }
  }
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
