<template>
  <div class="goods-sku">
    <dl v-for='(item, i) in specs' :key='i'>
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for='(tag, n) in item.values' :key='n'>
          <img :class='{selected: tag.selected, disabled: tag.disabled}' v-if='tag.picture' :src="tag.picture" alt="" @click='toggle(tag, item.values)'>
          <span :class='{selected: tag.selected, disabled: tag.disabled}' v-else @click='toggle(tag, item.values)'>{{tag.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set.js'
const spliter = '★'

// 计算SKU路径字典
const getPathMap = (originSet) => {
  // 最终形成的路径字典
  const result = {}
  // 遍历所有的sku信息
  originSet.forEach(sku => {
    // 排除无效SKU
    if (sku.inventory === 0) return
    // 后续处理表示有效SKU
    // 获取有效的SKU值:[蓝色, 中国, 20cm]
    const validSku = sku.specs.map(item => item.valueName)
    // 计算SKU的子集（笛卡尔集）
    const subset = getPowerSet(validSku)
    // 遍历subset,生成路径字典
    subset.forEach(path => {
      // 排除空集
      if (path.length === 0) return
      // 基于子集项目拼接字符串
      const pathKey = path.join(spliter)
      if (result[pathKey]) {
        // 字典已经存在该属性
        result[pathKey].push(sku.id)
      } else {
        // 字典中尚不存在该属性
        result[pathKey] = [sku.id]
      }
    })
  })
  return result
}

// 获取当前选中的规格数据
const getSelectedValue = (specs) => {
  const result = []
  specs.forEach((item, i) => {
    const tagObj = item.values.find(tag => tag.selected)
    if (tagObj) {
      // 其中一个选项选中了，存取选中的标签的名称
      result[i] = tagObj.name
    } else {
      // 一个标签也没有选中
      result[i] = undefined
    }
  })
  return result
}

// 控制规格标签是否被禁用
const updateDisabledStatus = (specs, pathMap) => {
  // seletedValues = [undefined, undefined, undefined]
  specs.forEach((spec, i) => {
    // 每次规格的遍历，选中的值需要重新初始化
    const seletedValues = getSelectedValue(specs)
    spec.values.forEach(tag => {
      if (tag.selected) {
        // 标签本身就是选中状态，不需要处理
        return
      } else {
        // 没有选中（初始化时，需要判断当个规格的禁用状态）
        seletedValues[i] = tag.name
      }
      // 此时，需要判断当前的按钮是否应该被禁用
      // 基于当前选中的值，组合一个路径
      // 过滤掉undefined值，基于剩余的值组合一个路径
      let currentPath = seletedValues.filter(item => item)
      if (currentPath.length > 0) {
        // 拼接路径字符串 currentPath = 黑色★10cm
        currentPath = currentPath.join(spliter)
        // 判断当前的路径是否在路径字典中(如果在字典中没有找到该路径，证明当前的标签应该禁用)
        tag.disabled = !pathMap[currentPath]
      }
      // 单独判断单个按钮是否应该禁用
      // tag.disabled = !pathMap[tag.name]
    })
  })
}

// 初始化规格的选中状态（根据skuId）
const initSkuSeletedStatus = (skuId, specs, skus) => {
  // 1、根据SKUId获取对应的sku详细信息
  const currentSku = skus.find(item => item.id === skuId)
  // 2、控制currentSku.specs中的规格进行选中
  specs.forEach(item => {
    // 3、得到需要选中的规格的值
    const selectedValue = currentSku.specs.find(skuItem => skuItem.name === item.name).valueName
    // 4、根据selectedValue控制规格的选中
    item.values.find(tag => tag.name === selectedValue).selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    // 商品的规格参数
    specs: {
      type: Array,
      default: () => []
    },
    skus: {
      type: Array,
      default: () => []
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 计算路径字典
    const pathMap = getPathMap(props.skus)

    // 根据SKUId初始化规格的选中状态
    if (props.skuId) {
      initSkuSeletedStatus(props.skuId, props.specs, props.skus)
    }

    // 初始化左侧规格列表时调用一次
    updateDisabledStatus(props.specs, pathMap)

    // 控制当前标签的选中和反选
    const toggle = (tag, list) => {
      // 如果此时按钮就是禁用状态，终止后续代码
      if (tag.disabled) return
      if (tag.selected) {
        // 如果有selected属性并且值为true，证明已经选中
        tag.selected = false
      } else {
        // 没有selected属性或者值为false,没有选中
        // 先把同类标签所有的selected状态设置Wiefalse(取消选中)，当前的标签状态设置为选中
        list.forEach(item => {
          item.selected = false
        })
        tag.selected = true
      }
      // 每次点击，所有的按钮需要再判断一般
      updateDisabledStatus(props.specs, pathMap)
      // 获取此时选中的规格的所有的值，传递给父组件
      // 1、如果所有的规格都选择了才是合理的
      // 2、如果有未选的的规格，就不应该得到数据
      const result = getSelectedValue(props.specs)
      if (result.filter(item => item).length === props.specs.length) {
        // 所有的规格都进行了选择
        // 有效数据：skuId,price,oldPrice,inventory,specsText (来源于SKU记录)
        // 根据当前的选中的规格结果，拼接路径字典key
        const pathKey = result.join(spliter)
        // 根据路径获取路径字典中存储的skuId
        const skuId = pathMap[pathKey][0]
        // 根据SKUId获取详细数据
        const sku = props.skus.find(item => item.id === skuId)
        // 拼接specsText数据
        // let specsText = ''
        // sku.specs.forEach(item => {
        //   specsText += item.name + ':' + item.valueName + ','
        // })
        // if (specsText.length > 0) {
        //   specsText = specsText.substring(0, specsText.length - 1)
        // }
        let specsText = sku.specs.reduce((result, item) => result + item.name + ':' + item.valueName + ',', '')
        specsText = specsText.length > 0 && specsText.substring(0, specsText.length - 1)
        // 组合有效数据
        const specInfo = {
          skuId: skuId,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: specsText
        }
        emit('sku-info', specInfo)
      } else {
        // 还有规格没有选
        emit('sku-info', {})
      }
    }

    return { toggle }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
