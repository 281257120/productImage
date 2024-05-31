/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2023-04-18 15:31:34
 * @Description: Do not edit
 * @LastEditors: zouyaoji 370681295@qq.com
 * @LastEditTime: 2023-04-18 15:43:28
 * @FilePath: \web-template-2023\lint-staged.config.js
 */
// lint-staged.config.js
module.exports = {
  '*.{js,jsx}': ['eslint --cache --fix'],
  '*.{ts,tsx}': [() => 'tsc --skipLibCheck --noEmit', 'eslint --cache --fix'],
  '*.vue': [() => 'vue-tsc -p tsconfig.json --noEmit', 'eslint --cache --fix']
}
