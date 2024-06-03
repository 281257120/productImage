<!--
* @Description:
* @Author: Liu Yang
* @Date: 2023-03-17 14:02:49
 * @LastEditTime: 2024-06-03 14:19:47
 * @LastEditors: Liu Yang
-->
<template>
  <div class="drag-box text-white">
    <ModelList :model-menu="modelMenu" :is-changed="isChanged" @update:changeModel="changeModel" />
    <ModelShow
:sel-item="selItem" :json-string="jsonString" :default-data="defaultData" :img-url="imgUrl"
      @update:isChangeJSON="isChangeJSON" @changeDefaultValue="changeDefaultValue" />
  </div>
</template>

<script setup lang='ts'>
import { onMounted, onBeforeMount, computed, nextTick, reactive, ref, watch } from 'vue'
import { store, pinia } from '@src/store'
import ModelList from './model-list/Index.vue'
import ModelShow from './model-show/Index.vue'
import * as api from '@src/api'
import useDataFromat from './model-show/useDataFromat'

import allFormat from '@src/assets/json/imageAllFormat.json'


const { formatData } = useDataFromat()
const baseUrl = import.meta.env.VITE_VUE_ROUTER_BASE
console.log(baseUrl)
// const modelMenu = ref([
//   {
//     name: '地图模板',
//     children: [
//       {
//         name: '气温',
//         children: [
//           {
//             name: '空间分布图',
//             imgurl: 'model.png',
//             json: {
//               "name": "地震烈度分析",
//               "id": "1",
//               "w": "100",
//               "h": "100"
//             }
//           },
//           {
//             name: '站点分布图',
//             imgurl: 'model2.png',
//             json: {
//               "name": "地震烈度分析",
//               "id": "1",
//               "w": "100",
//               "h": "100"
//             }
//           }
//         ]
//       },
//       {
//         name: '降水',
//         imgurl: 'model2.png',
//         json: {
//           "name": "地图模板2",
//           "id": "2",
//           "w": "100",
//           "h": "100"
//         }
//       },
//       {
//         name: '风',
//         imgurl: 'model3.png',
//         json: {
//           "name": "地图模板3",
//           "id": "3",
//           "w": "100",
//           "h": "100"
//         }
//       },
//       {
//         name: '湿度',
//         imgurl: 'model3.png',
//         json: {
//           "name": "地图模板4",
//           "id": "1",
//           "w": "100",
//           "h": "100"
//         }
//       },
//     ]
//   },
//   {
//     name: '数据模板',
//     children: [
//       {
//         name: '数据模板1',
//         imgurl: 'model3.png',
//         json: {
//           "name": "数据模板1",
//           "id": "1",
//           "w": "100",
//           "h": "100"
//         }
//       },
//     ]
//   }
// ])
const modelMenu = ref([
  {
    name: '地图模板',
    children: [
      {
        name: '产品制作',
        children: [
          {
            name: '绍兴市实况气温分布图',
            imgurl: '绍兴市实况气温分布图.png',
            jsonurl: '绍兴市实况气温分布图.json',
            catalogue: '产品制作',
          },
          {
            name: '绍兴市实况降水分布图',
            imgurl: '绍兴市实况降水分布图.png',
            jsonurl: '绍兴市实况降水分布图.json',
            catalogue: '产品制作',
          }
        ]
      },
      {
        name: '风险大师',
        children: [
          {
            name: '地震烈度分析',
            imgurl: '地震烈度分析.png',
            jsonurl: '地震烈度分析.json',
            catalogue: '风险大师',
          }
        ]
      }
    ]
  },
  {
    name: '数据模板',
    children: [
      {
        name: '数据模板1',
        imgurl: 'model3.png',
      },
    ]
  }
])
const selItem = ref({}) as any
const jsonString = ref('')
const isChanged = ref(false)
const imgUrl = ref('') as any
const defaultData = ref([])

const isChangeJSON = obj => {
  const { f, json } = obj
  isChanged.value = f
  jsonString.value = JSON.stringify(json, null, 2)
  // changeDefaultValue()
}

watch(jsonString, val => {
  // console.log(val)
})

const theme = computed(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})

//递归找到 modelMenu.value下index等于key的item
const findItem = (arr, key) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].index === key) {
      return arr[i]
    } else if (arr[i].children) {
      const item = findItem(arr[i].children, key)
      if (item) {
        return item
      }
    }
  }
}

const changeModel = key => {
  store.system.useUserStore(pinia).changeLevelsTemp([])
  selItem.value = findItem(modelMenu.value, key)
  const jsonUrl = `example/para/${selItem.value.catalogue}/${selItem.value.jsonurl}`
  imgUrl.value = `example/png/${selItem.value.catalogue}/${selItem.value.imgurl}`

  api.common.getStaticData(jsonUrl).then(res => {
    // jsonString.value = JSON.stringify(selItem.value.json, null, 2)
    isChangeJSON({ f: false, json: res.data })
    changeDefaultValue()
  })
}

const changeDefaultValue = () => {
  // defaultData.value = []
  nextTick(() => {
    defaultData.value = formatData(JSON.parse(jsonString.value), allFormat)
    console.log('最终模板数据:', defaultData.value)
  })
}
//地图给menu添加index
const addModelMenuIndex = (ls, index_ = '') => {
  ls.forEach((item, index) => {
    if (item.children && item.children.length) {
      item.index = index_ ? `${index_}-${index}` : `${index}`
      addModelMenuIndex(item.children, item.index)
    } else {
      item.index = index_ ? `${index_}-${index}` : `${index}`
    }
  })
}

onBeforeMount(() => {
  addModelMenuIndex(modelMenu.value)
})


</script>
<style lang='scss' scoped>
.drag-box {
  width: 100%;
  height: 100%;
  padding-top: 3rem;
  background-color: v-bind('theme.header.themeHeaderContentBackgroundColor');
  display: flex;
  font-size: .8rem;
}
</style>
