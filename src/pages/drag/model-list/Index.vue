<!--
* @Description:
* @Author: Liu Yang
* @Date: 2023-03-17 14:02:49
 * @LastEditTime: 2024-05-29 17:31:07
 * @LastEditors: Liu Yang
-->
<template>
  <div class="model-list">
    <el-menu :default-active="activeIndex" class="el-menu-demo" :text-color="theme.header.themeHeaderColor"
      :active-text-color="theme.menu.themeMenuActiveBackgroundColor" background-color="rgba(255, 255, 255, .1)"
      @select="handleSelect">
      <MenuTree v-for="menuItem in modelMenu" :key="menuItem.name" :menuItem="menuItem" />
    </el-menu>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, computed, nextTick, reactive, ref, watch } from 'vue'
import { store, pinia } from '@src/store'
import MenuTree from '../compoents/MenuTree.vue'

const emits = defineEmits(['update:changeModel'])

const props = defineProps({
  modelMenu: {
    type: Object,
    default: () => { }
  },
  isChanged: {
    type: Boolean,
    default: false
  }
})
const activeIndex = ref('0-0-0')
const theme = computed(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})
const handleSelect = (key, keyPath) => {
  console.log("是否改变了JSON：", props.isChanged, key, keyPath)
  emits('update:changeModel', key)
}

onMounted(() => {
  emits('update:changeModel', '0-0-0')
})
</script>
<style lang='scss' scoped>
.model-list {
  width: 20rem;
  height: 100%;
  padding: .5rem;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background-color: v-bind('theme.header.themeHeaderContentBackgroundColor');

  .el-menu {
    border-right: none;
  }
}
</style>
