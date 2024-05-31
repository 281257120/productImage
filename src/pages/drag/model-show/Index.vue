<!--
* @Description:
* @Author: Liu Yang
* @Date: 2023-03-17 14:02:49
 * @LastEditTime: 2024-05-31 13:39:21
 * @LastEditors: Liu Yang
-->
<template>
  <div class="model-show">
    <div class="content">
      <el-image style="width: 100%;height: 100%; " :src="imgUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
        :preview-src-list="[imgUrl]" :initial-index="0" fit="contain" />
    </div>
    <div class="right">
      <div class="input-wrap">
        <div class="title">出图配置</div>
        <div class="ele-input">
          <el-collapse :model-value="activeNames" @change="handleChange1">
            <el-collapse-item v-for="(item, index) in defaultData" :key="index" :name="index">
              <template #title>
                <div><span class="iconfont" :class="item.icon"></span>{{ item.title }}({{ item.prop }})</div>
              </template>
              <InputTree :menuItem="item" :defaultData="defaultData" @inputChange="inputChange" />
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="foot-btn">
          <el-button @click="changeActiveNames(0)" type="primary" plain>
            <span style="margin-right: 5px;" class="iconfont icon-shousuojiantou"></span>展开所有
          </el-button>
          <el-button @click="changeActiveNames(1)" type="primary" plain>
            <span style="margin-right: 5px;" class="iconfont icon-shousuoshangjiantou"></span>合并所有
          </el-button>
        </div>

      </div>
      <div class="json-wrap">
        <div class="title">JSON数据</div>
        <el-input ref="elInputRef" class="json-input" @mouseenter.self="showCopyBtn = true"
          @mouseleave.self="showCopyBtn = false" v-model="jsonString" @input="jsonChange" autosize type="textarea"
          placeholder="Please input">
        </el-input>
        <el-button @mouseenter.self="showCopyBtn = true" v-show="showCopyBtn" @click="copyJson" size="small" type="info"
          class="copy-btn">复制</el-button>
        <div class="foot-btn">
          <el-button @click="saveJson" type="primary" plain>保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import InputTree from '../compoents/InputTree.vue'
import jsonTemplate from '@src/assets/json/draw_spatial_graph.json'
import { store, pinia } from '@src/store'

const mjsonObj = ref({})
const areaLev = ref('0')
const elInputRef = ref(null)


const levelsTemp = computed(() => {
  return store.system.useUserStore(pinia).levelsTemp
})

const props = defineProps({
  selItem: {
    type: Object,
    default: () => { }
  },
  jsonString: {
    type: String,
    default: ''
  },
  imgUrl: {
    type: String,
    default: ''
  },
  defaultData: {
    type: Object,
    default: () => { }
  }
})


//全部展开
const activeNames = ref([])


const showCopyBtn = ref(false)
const emits = defineEmits(['update:isChangeJSON', 'changeDefaultValue'])

const handleChange1 = (val: any) => {
  console.log(val)
}
//改变json输入框事件
const jsonChange = () => {
  try {
    const json = JSON.parse(props.jsonString);
    emits('changeDefaultValue')
    emits('update:isChangeJSON', { f: true, json })
  } catch (error) {
    ElMessage({
      message: 'JSON格式不合法,请重新配置',
      type: 'warning',
    })
  }
}

//展开,合并所有
const changeActiveNames = (type: number) => {
  if (type == 0) {
    activeNames.value = props.defaultData.map((ele, index) => index)
  } else {
    activeNames.value = []
  }
}

//改变按钮 输入框事件
const inputChange = (targetProperty) => {
  const json = JSON.parse(props.jsonString);
  changeJson(json, props.defaultData, true)
  changeJson(jsonTemplate, props.defaultData, false)
  emits('update:isChangeJSON', { f: true, json })
  nextTick(() => {
    scrollToProperty(targetProperty)
  })
}

const changeJson = (json, defaultData, isClear) => {
  // console.log(json, defaultData)
  defaultData.forEach((ele, index) => {
    //若果是可忽略的参数&&选中了忽略，直接设置为{}
    if (ele.isNegligible && !ele.ngligibleVal && isClear) {
      json[ele.prop] = {}
      // 如没有使用grade_para分级方法，levels该参数必填
      if (ele.prop == 'grade_para') {
        json.contour_f.levels = levelsTemp.value
        let contour_f_obj = defaultData.filter(ele => ele.prop == "contour_f")[0]
        let levels_obj = contour_f_obj.children.filter(ele => ele.prop == "levels")[0]
        if (levelsTemp.value.length) {
          levels_obj.value = levelsTemp.value
        } else {
          let color_code_obj = contour_f_obj.children.filter(ele => ele.prop == "color_code")[0]
          let arr = []
          let len = color_code_obj.value.length
          if (store.system.useUserStore(pinia).className == 'neither') {
            len++
          }
          if (store.system.useUserStore(pinia).className == 'both') {
            len--
          }
          for (let i = 0; i < len; i++) {
            arr.push(5 * i)
          }
          store.system.useUserStore(pinia).changeLevelsTemp(arr)
          levels_obj.value = arr
        }
      }
    }
    else {
      if ('type' in ele) {
        if (ele.type == 'color-picker-list') {
          // console.log(json[ele.prop], ele)
        }
        if (ele.prop == 'area_lev') {
          areaLev.value = ele.value
        }
        if (ele.prop == 'river_system') {

        }
        if (ele.prop == 'subordinate_regions') {
          ele.checkeds.forEach((e, i) => {
            if (e.lower_level > areaLev.value) {
              e.isDisabled = false
            } else {
              e.isDisabled = true
              e.value = false
              ele.value.forEach((item, index) => {
                if (item.lower_level == e.lower_level) {
                  //删除
                  ele.value.splice(index, 1)
                }
              })
            }
          })
        }
        if (ele.prop === "") {
          json[index] = ele.value
        } else {
          if (json && Object.keys(json).length) {
            json[ele.prop] = ele.value
          }
        }
      } else {
        //自定义内容
        if (ele.isCuntom && ele?.popupObj.type == 'radio') {
          if (ele.popupObj.value) {
            ele.popupObj.valueArr = ele.children.map(item => +item.value)
          }
          json[ele.prop] = ele.popupObj.valueArr
        } else {
          if (!(json[ele.prop] && Object.keys(json[ele.prop]).length)) {
            mjsonObj.value = {}
            getJsonTemplate(jsonTemplate, ele)
            json[ele.prop] = mjsonObj.value
            //如果使用 grade_para 分级方法，levels参数失效，
            if (ele.prop == 'grade_para') {
              store.system.useUserStore(pinia).changeLevelsTemp(json.contour_f.levels)
              let grade_para_obj = defaultData.filter(ele => ele.prop == "grade_para")[0]
              let n_classes_obj = grade_para_obj.children.filter(ele => ele.prop == "n_classes")[0]
              n_classes_obj.value = json.contour_f.color_code.length

              let contour_f_obj = defaultData.filter(ele => ele.prop == "contour_f")[0]
              let levels_obj = contour_f_obj.children.filter(ele => ele.prop == "levels")[0]
              levels_obj.value = []
            }
          } else {
            changeJson(json[ele.prop], ele.children, isClear)
          }
        }

      }
    }

  })
}
const getJsonTemplate = (json, item) => {
  if (typeof json == 'object' && Object.keys(json).length) {
    for (let prop in json) {
      if (prop == item.prop) {
        if (typeof json[prop] == 'object' && Object.keys(json[prop]).length) {
          mjsonObj.value = json[prop]
        }
      } else {
        getJsonTemplate(json[prop], item)
      }
    }
  }
}

const saveJson = () => {
  try {
    const json = JSON.parse(props.jsonString);
    emits('update:isChangeJSON', { f: false, json })
    console.log('JSON saved:', json);
    // 在这里执行保存操作
    ElMessage({
      message: '保存成功',
      type: 'success',
    })
  } catch (e) {
    console.error('JSON不合法:', e);
    ElMessage({
      message: 'JSON格式不合法,请重新配置',
      type: 'warning',
    })
  }
}
const copyJson = () => {
  try {
    const json = JSON.parse(props.jsonString);
    const jsonStr = JSON.stringify(json, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      ElMessage({
        message: '已复制至剪切板',
        type: 'success',
      })
    }).catch(err => {
      console.log(err)
      ElMessage({
        message: '复制失败',
        type: 'error',
      })
    })
  } catch (error) {
    ElMessage({
      message: '复制失败,JSON格式不合法,请重新配置',
      type: 'error',
    })
  }
}

const scrollToProperty = (targetProperty) => {
  if (!targetProperty) return
  const jsonInput = document.getElementsByClassName('el-textarea__inner')[1] as any
  try {
    // const targetProperty = 'grade_para'; // 替换为你要滚动到的目标属性
    // 找到目标属性在字符串中的位置
    const targetIndex = props.jsonString.indexOf(`"${targetProperty}"`);
    jsonInput.focus();
    jsonInput.setSelectionRange(targetIndex + 1, targetIndex + targetProperty.length + 1)
    // console.log('targetIndex', targetIndex)
    // 找到目标属性在 JSON 中的位置
    const targetPosition = findPropertyPosition(props.jsonString, targetProperty);
    // 如果找到目标属性，则滚动到该位置
    if (targetPosition !== null) {
      jsonInput.scrollTop = targetPosition;
    }
  } catch (error) {
    console.error('Invalid JSON format:', error);
  }
}

const findPropertyPosition = (jsonString, targetProperty) => {
  const lineHeight = 20; // 假设每行的高度为 20px
  let jsonArr = jsonString.split('\n')
  //targetProperty在jsonArr中的位置
  let len = -1
  jsonArr.forEach((item, i) => {
    let index = item.indexOf(`"${targetProperty}"`)
    if (index != -1) {
      len = i
    }
  })

  if (len !== -1) {
    return len * lineHeight
  } else {
    return null
  }
}

// const findPropertyPosition = (obj, targetProperty) => {
//   // 将对象转换为 JSON 字符串
//   const jsonStr = JSON.stringify(obj);
//   // 找到目标属性在字符串中的位置
//   const targetIndex = jsonStr.indexOf(`"${targetProperty}"`);
//   // 如果找到目标属性，则返回其在输入框中的位置
//   if (targetIndex !== -1) {
//     let textBeforeTarget = jsonStr.substring(0, targetIndex);

//     textBeforeTarget = ' "data_sources": "./data/csv/obs_1.csv"'
//     console.log(textBeforeTarget)
//     // 计算目标属性之前的换行符数量，乘以每行的高度，就是目标位置的 scrollTop
//     const linesBeforeTarget = textBeforeTarget.split('\n').length;
//     console.log(linesBeforeTarget, jsonStr, targetIndex)
//     const lineHeight = 20; // 假设每行的高度为 20px
//     return linesBeforeTarget * lineHeight;
//   }
//   return null; // 如果未找到目标属性，则返回 null
// }
</script>
<style lang='scss' scoped>
@import '@assets/style/mixin.scss';

.model-show {
  height: 100%;
  width: calc(100% - 20rem);
  padding: 1rem;
  position: relative;

  .content {
    width: calc(100% - 40rem);
    height: 100%;
    padding-right: 1rem;
  }

  .right {
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    padding: .5rem;
    display: flex;

    .title {
      color: var(--themeHeaderColor);
      height: 1.5rem;
      line-height: 1.5rem;
    }

    .input-wrap {
      position: relative;
      width: 25rem;
      height: calc(100% - 4rem);

      .ele-input {
        height: 100%;
        @include scroll();
        overflow-y: auto;
        overflow-x: hidden;

        :deep(.el-collapse-item__content) {
          padding-bottom: 1rem;
        }

        .iconfont {
          margin-right: .5rem;
        }
      }
    }

    .json-wrap {
      position: relative;
      height: calc(100% - 4rem);
      width: 15rem;

      .json-input {
        height: 100%;

        :deep(.el-textarea__inner) {
          @include scroll();
          height: 100% !important;
          // max-height: 100% !important;
          overflow-y: auto;
          overflow-x: hidden;
          font-size: .7rem;
          line-height: 20px;
        }
      }

      .copy-btn {
        position: absolute;
        top: 1.5rem;
        right: 0;
      }
    }


  }

  .foot-btn {
    margin-top: .5rem;
    display: flex;
    justify-content: end
  }
}
</style>
