<!--
* @Description:
* @Author: Liu Yang
* @Date: 2023-03-17 14:02:49
 * @LastEditTime: 2024-05-29 17:19:09
 * @LastEditors: Liu Yang
-->
<template>
  <el-sub-menu v-if="menuItem.children && menuItem.children.length" :index="menuItem.index">
    <template #title>
      {{ menuItem.name }}
    </template>
    <MenuTree v-for="child in menuItem.children" :key="child.name" :menuItem="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="menuItem.index">
    {{ menuItem.name }}
  </el-menu-item>
</template>

<script setup lang='ts'>
import { onMounted, computed, nextTick, reactive, ref, watch } from 'vue'
import MenuTree from './MenuTree.vue'

const props = defineProps({
  menuItem: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>
<style lang='scss' scoped></style>
