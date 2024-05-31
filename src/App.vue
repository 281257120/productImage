<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-08 23:26:13
 * @LastEditTime: 2024-05-17 16:33:21
 * @LastEditors: Liu Yang
 * @Description:
 * @FilePath: \drag-demo\src\App.vue
-->
<template>
  <router-view />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
  //适配rem 注释掉刷新页面1rem = 10px
  (function (doc, win) {
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        // console.log(10 * (clientWidth / 1920) + 'px')
        docEl.style.fontSize = 20 * (clientWidth / 1920) + 'px';
      };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window);
})

</script>
<style lang="scss">
@import '@src/assets/style/animate/animate.min.css';

.cesium-viewer {
  display: none !important;
}


:root {
  --themeColor: #fff;
  --themeColorAlpha: rgba(#fff, 0.6);
  --themeBGColor: #ebf1f6;
  --themeBGMaskColor: rgba(#000, 0);
  --themeScrollTopBackgroundColor: rgba(0, 0, 0, 0);
  --themeQInputColor: #fff;
  --themeQInputBorderColor: #fff9;
  --themeQCheckboxTruthyColor: #1976d2;
  --themeQMenuColor: #fff;
  --themeQMenuBackgroundColor: rgba(0, 68, 82, 0.6);
  --themeQCardColor: #fff;
  --themeQCardBackgroundColor: rgba(0, 68, 82, 0.6);
  --themeQScrollAreaColor: #fff;
  font-size: 1.4rem;
}

.loading-ios {
  color: var(--themeColor);
}

.scroll-top {
  color: var(--themeColor);
  background: var(--themeScrollTopBackgroundColor);
}

// q-input
.q-field__label,
.q-field__control,
.q-field--highlighted .q-field__control {
  color: var(--themeColor) !important;
}

.q-field__control:before {
  border-color: var(--themeQInputBorderColor) !important;
}

.q-field__control:hover:before {
  border-color: var(--themeColor) !important;
}

.q-field__input,
.q-field__native,
.q-field__prefix,
.q-field__suffix {
  color: var(--themeQInputColor);
}

// q-checkbox
.q-checkbox__inner--truthy,
.q-checkbox__inner--indet,
.q-radio__inner--truthy {
  color: var(--themeQCheckboxTruthyColor);
}

.q-checkbox__inner--falsy,
.q-radio__inner--falsy {
  color: var(--themeCommonPanelListBorderColor);
}

// q-scroll-area
.q-scrollarea__thumb {
  background: var(--themeQScrollAreaColor);
}

// q-menu
.q-menu {
  color: var(--themeQMenuColor);
  background: var(--themeQMenuBackgroundColor);
}

// q-card
.q-card {
  color: var(--themeQCardColor);
  background: var(--themeQCardBackgroundColor);
}

.card-header {
  background: var(--themeQCardHeaderBackgroundColor);
}

.popup-msg {
  color: var(--el-color-danger);
}
</style>
