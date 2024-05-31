/*
 * @Description:
 * @Author: Liu Yang
 * @Date: 2024-05-15 14:27:24
 * @LastEditTime: 2024-05-31 15:17:48
 * @LastEditors: Liu Yang
 * @FilePath: \web\src\pages\drag\model-show\useDataFromat.ts
 */
import * as api from '@src/api'
import { onMounted, computed, nextTick, reactive, ref, watch } from 'vue'
import { store, pinia } from '@src/store'
import jsonTemplate from '@src/assets/json/draw_spatial_graph.json'

const useDataFromat = function () {
  let imgFormat = []
  let notUseFormat = []
  let lackFormat = []
  const jsonObj = ref({})
  const areaLev = ref('0')
  //根据json从所有模板中获取应有的模板，并赋值
  const formatData = (data, ls_) => {
    notUseFormat = []
    lackFormat = []
    let ls = JSON.parse(JSON.stringify(ls_))
    imgFormat = []
    //从所有模板中找到匹配的模板
    for (let prop in data) {
      ls.forEach(item => {
        if (item.prop === prop) {
          imgFormat.push(item)
        }
      })
    }
    //把配到到的模板填充数据
    const list = getimgFormat(data, imgFormat)
    //确定哪些不展示
    getimgFormatNoValue(data, list)
    //删除标记为isNotShow的子项
    deleteNotShowFromList(list)
    getMessage(data, list, ls)
    return list
  }

  const deleteNotShowFromList = (list) => {
    list.forEach(item => {
      if (item.children) {
        item.children = item.children.filter(child => !child.isNotShow);
        deleteNotShowFromList(item.children)
      }
    })
  }

  const getimgFormat = (data, ls) => {
    // console.log(data, data.constructor.name, ls)
    if (data.constructor.name == 'Array') {
      data.forEach((item, index) => {
        ls[index].value = item
      })
    } else {
      for (let prop in data) {
        if (data[prop]) {
          ls.forEach(item => {
            if (item.prop === prop) {
              if ('type' in item) {
                if (prop == 'xticks') {
                  item.max = data.length
                }
                if (prop == 'area_lev') {
                  areaLev.value = data[prop]
                }
                if (prop == 'extend') {
                  store.system.useUserStore(pinia).changeClassName(data[prop])
                }
                if (prop == 'river_system') {
                  data[prop].forEach((ele, index) => {
                    let i = ele.lower_level
                    if (item.checkeds[i - 1]) {
                      item.checkeds[i - 1].value = true
                    }
                  })
                }
                if (prop == 'subordinate_regions') {
                  //只能选比区域等级小的
                  item.checkeds.forEach(ele => {
                    if (ele.lower_level <= areaLev.value) {
                      ele.isDisabled = true
                    } else {
                      ele.isDisabled = false
                    }
                  })
                  data[prop].forEach((ele, index) => {
                    let i = ele.lower_level
                    if ('vector_markers' in ele) {
                      console.log(ele, Object.keys(ele.vector_markers).length)
                      if (Object.keys(ele.vector_markers).length) {
                        ele.is_display = true
                      } else {
                        ele.is_display = false
                      }
                    }
                    if (i > areaLev.value) {
                      item.checkeds[i - 1].value = true
                    }
                  })
                }
                item.value = data[prop]
                //自定义内容
                if (item.isCuntom && item?.popupObj.type == 'radio') {
                  item.popupObj.value = data[prop]
                  let isFind = false
                  item.popupObj.children.forEach(ele => {
                    if (data[prop].includes(ele.type)) {
                      isFind = true
                      ele.value = data[prop]
                    }
                  })
                  if (!isFind) item.popupObj.children[0].value = data[prop]
                }
              } else {
                //自定义内容
                if (item.isCuntom && item?.popupObj.type == 'radio') {
                  item.popupObj.value = data[prop].toString()
                  item.popupObj.children.forEach(ele => {
                    if (ele.value.length && data[prop].toString().length) {
                      ele.value = data[prop].toString()
                    }
                  })
                  data[prop].forEach((ele, index) => {
                    item.children[index].value = +ele
                  })
                } else if (Object.keys(data[prop]).length == 0) { // 对象为{}得话,从所有json中赋默认值
                  item.isNegligible = true
                  item.ngligibleVal = false
                  let obj = {}
                  jsonObj.value = {}
                  getJsonTemplate(jsonTemplate, item)
                  getimgFormat(jsonObj.value, item.children)
                } else {
                  getimgFormat(data[prop], item.children)
                }
              }
            }
          })
        }
      }
    }
    return ls
  }

  const getJsonTemplate = (json, item) => {
    if (typeof json == 'object' && Object.keys(json).length) {
      for (let prop in json) {
        if (prop == item.prop) {
          if (typeof json[prop] == 'object' && Object.keys(json[prop]).length) {
            jsonObj.value = json[prop]
          }
        } else {
          getJsonTemplate(json[prop], item)
        }
      }
    }
  }

  const getimgFormatNoValue = (data, imgFormat) => {
    imgFormat.forEach((item, index) => {
      if ((item.prop) in data || item.prop == "") {
        if (!('value' in item) && item?.children && !item.isNegligible) {
          getimgFormatNoValue(data[item.prop], item.children)
        }
      } else {
        //没有配置isNegligible || 没有这个属性的直接不展示
        if (!item.isNegligible || !((item.prop) in data)) {
          item.isNotShow = true
        }
        notUseFormat.push(item.prop)
      }
    })
  }


  // 获取未使用的模板提示
  const getMessage = (data, imgFormat, allFormat) => {
    allFormat.forEach(item => {
      if (!imgFormat.includes(item)) {
        notUseFormat.push(item.title)
      }
    })
    for (let prop in data) {
      if (!allFormat.some(item => item.prop === prop)) {
        lackFormat.push(prop)
      }
    }
    console.log('已配置，未使用的模板\n', notUseFormat)
    console.log('json已传入，但缺少的模板\n', lackFormat)
  }


  return {
    formatData
  }
}
export default useDataFromat
