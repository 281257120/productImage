/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-07-21 17:19:48
 * @LastEditTime: 2022-09-20 10:46:50
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\modules\dynamic-render.ts
 */
import qs from 'qs'
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import Adapter from 'axios-mock-adapter'
import { RequestTools } from '..'
import treeData from './tree-data'

const baseURL = import.meta.env.MODE === 'development' ? '/' : import.meta.env.VITE_VUE_APP_API
export default ({
  service,
  request,
  serviceForMock,
  requestForMock,
  mock,
  tools
}: {
  service: AxiosInstance
  request: (config: AxiosRequestConfig<any>) => Promise<any>
  serviceForMock: AxiosInstance
  requestForMock: (config: AxiosRequestConfig<any>) => AxiosPromise<any>
  mock: Adapter
  tools: RequestTools
}) => ({
  /**
   * 获取静态资源（JSON）等
   * @param {*} fetchStr
   * @returns
   */
  getTreeData() {
    mock.onAny('/dynamic-render/recursive-list/datatree').reply(config => {
      return tools.responseSuccess(treeData)
    })
    // 接口请求
    return requestForMock({
      url: '/dynamic-render/recursive-list/datatree',
      method: 'post'
    })
  },
  /**
   * 百度 api 解析地址
   * @param query
   * @returns
   */
  inverseGeocode(query) {
    return request({
      baseURL: import.meta.env.BASE_URL,
      url: '/reverse_geocoding/v3',
      method: 'get',
      params: query
    })
  }
})
