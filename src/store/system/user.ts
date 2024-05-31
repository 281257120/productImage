/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-13 16:13:37
 * @LastEditTime: 2024-05-31 10:29:24
 * @LastEditors: Liu Yang
 * @Description:
 * @FilePath: \web\src\store\system\user.ts
 */
import { UserInfo } from '@src/types/user'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useDBStore } from './db'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useUserStore = defineStore('user', {
  // a function that returns a fresh state
  state: () => ({
    info: {} as UserInfo,
    className: '',
    levelsTemp: []
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set(info) {
      // store 赋值
      this.info = info
      const dbStore = useDBStore()
      // 持久化
      dbStore.set({
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load() {
      // store 赋值
      const dbStore = useDBStore()
      const info = dbStore.get({
        dbName: 'sys',
        path: 'user.info',
        defaultValue: '',
        user: true
      })
      this.set(info)
    },
    changeClassName(name) {
      this.className = name
    },
    changeLevelsTemp(ls) {
      this.levelsTemp = ls
    },
    deleteLevelsTemp() {
      console.log(this.levelsTemp, 9090)
      if (this.levelsTemp.length) {
        this.levelsTemp.splice(-1, 1)
      }
    },
    addLevelsTemp() {
      if (this.levelsTemp.length) {
        this.levelsTemp.push(this.levelsTemp[this.levelsTemp.length - 1])
      }
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
