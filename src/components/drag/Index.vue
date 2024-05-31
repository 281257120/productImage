<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2023-04-18 15:51:25
 * @Description: Do not edit
 * @LastEditors: Liu Yang
 * @LastEditTime: 2024-05-13 10:14:21
 * @FilePath: \drag-demo\src\components\drag\Index.vue
-->
<template>
  <div ref="dragRef" class="drag-wrap">
      <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { store } from '@src/store'
import { ThemeOptions } from '@src/types/theme'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'

// state
const themeStore = store.system.useThemeStore()
const theme = computed<ThemeOptions>(() => {
  return themeStore.themeConfig[themeStore.activeName]
})

const { toggleGlobalLayout } = store.system.useLayoutStore()

const mapRef = ref<HTMLElement>()
const emit = defineEmits({
  mapReady: (map: Map) => true
})

onMounted(() => {
  const map = new Map({
    target: mapRef.value,
    view: new View({
      projection: 'EPSG:4326',
      center: [108, 32],
      zoom: 7
    }),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://devapi.songluck.cn:5443/map/shaoxing/white/{z}/{x}/{y}.png',
          projection: 'EPSG:3857',
          minZoom: 1,
          maxZoom: 9
        }),
        properties: { name: 'baseLayer' }
      })
    ]
  })
  map.addControl(
    new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: 'EPSG:4326',
      className: 'mousePosition'
    })
  )

  emit('mapReady', map)

  toggleGlobalLayout({
    header: true
  })
  setTimeout(() => {
    toggleGlobalLayout({
      content: true
    })
  }, 500)
})
</script>

<style lang="scss" scoped>
.drag-wrap {
  width: 100%;
  height: 100%;
}
</style>
