/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-28 17:42:33
 * @LastEditTime: 2024-05-15 14:06:55
 * @LastEditors: Liu Yang
 * @Description:
 * @FilePath: \drag-demo\src\config\theme\classic.ts
 */
/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-28 17:42:33
 * @LastEditTime: 2022-05-29 14:22:32
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\config\theme\classic.ts
 */
export const themeClassic = {
  /**
   * 主题名称
   */
  themeName: 'classic',
  global: {
    themeBGColor: '#ebf1f6',
    themeHeaderColor: '#cbe1e5',
    themeBGMaskColor: 'rgba(0, 0, 0, 0)',
    themeColor: '#cbe1e5',
    themeColorAlpha: 'rgba(255, 255, 255, 0.6)',
    themeColorActive: '#fff',
    themeScrollTopBackgroundColor: 'rgba(0, 0, 0, 0)',
    themeQInputColor: '#fff',
    themeQInputBorderColor: '#fff9',
    themeQCheckboxTruthyColor: '#1976d2',
    themeQMenuColor: '#fff',
    themeQMenuBackgroundColor: 'rgba(18,41,83,1)',
    themeQCardColor: '#fff',
    themeQCardHeaderBackgroundColor: 'rgba(18,41,83,.9)',
    themeQCardBackgroundColor: 'rgba(18,41,83,.9)',
    themeQScrollAreaColor: '#fff'
  },
  // 头部
  header: {
    /**
     * 头部主要文字颜色
     */
    themeHeaderColor: '#cbe1e5',
    /**
     * 头部标题颜色
     */
    themeHeaderTitleColor: '#fff',
    /**
     * 标题 logo 背景颜色
     */
    themeHeaderLogoBackgroundColor: 'rgba(255, 255, 255, 0)',
    /**
     * 标题第一层背景颜色
     */
    themeHeaderBackgroundColor: 'rgba(18,41,83,.9);',
    /**
     * 标题第二层(内容区域)背景颜色
     */
    themeHeaderContentBackgroundColor: 'rgba(18,41,83,.9)',
    themeHeaderBg: `url(${import.meta.env.VITE_VUE_APP_FYSB_STATIC}/pc-img/classic/抬头.webp)`,// 头部背景图
  },
  commonPanel: {
    /**
     * common-panel 面板 header 颜色
     */
    themeCommonPanelHeaderColor: '#fff',
    /**
     * common-panel 面板 header 背景颜色
     */
    themeCommonPanelHeaderBackgroundColor: 'rgba(0, 101, 122, 0.8)',
    /**
     * common-panel 面板 content 颜色
     */
    themeCommonPanelContentColor: '#fff',
    /**
     * common-panel 面板 content 背景颜色
     */
    themeCommonPanelContentBackgroundColor: 'rgba(0, 68, 82, 0.6)',
    /**
     * common-panel 面板中 q-list 颜色
     */
    themeCommonPanelListColor: '#fff',
    /**
     * common-panel 面板中 q-list 分割线、border 颜色
     */
    themeCommonPanelListBorderColor: 'rgba(255, 255, 255, 0.278)'
  },
  navigation: {
    themeVcCompassOuterIcon: 'svguse:#vc-icons-compass-outer',
    themeVcCompassOuterColor: 'rgba(0, 68, 82)',
    themeVcCompassInnerIcon: 'fa fa-compass',
    themeVcCompassInnerColor: 'rgba(255, 255, 255, 0.7)',
    themeVcCompassInnerBackgroundColor: 'rgba(0, 68, 82, 0.6)',
    themeVcZoomControlBackgroundColor: 'rgba(0, 68, 82, 0.6)',
    themeVcPrintBackgroundColor: 'rgba(0, 68, 82, 0.6)',
    themeVcStatusBarBackgroundColor: 'rgba(0, 68, 82, 0.8)',
    themeVcDistanceLegendBackgroundColor: 'rgba(0, 68, 82, 0.8)'
  },
  pageLogin: {
    themePageLoginColor: '#fff',
    themePageLoginBackground: 'rgba(29,29,29, 0.5)'
  },
  menu: {
    themeMenuColor: '#cbe1e5',
    themeMenuActiveColor: '#fff',
    themeMenuActiveBackgroundColor: '#00e5ff'
  }
}
