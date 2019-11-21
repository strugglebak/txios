import { TxiosRequestConfig } from './types'
import xhr from './xhr'
import { recreateUrl } from './helpers/url-helper'
import { transformRequest } from './helpers/data-helper'

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @description 封装的 axios 方法, 用 TypeScript 实现, 此为库函数入口
 */
export function txios(config: TxiosRequestConfig): void {
  handleConfig(config)
  xhr(config)
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @description 处理 config 中的 url
 */
function handleConfig(config: TxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @returns {string}
 * @description 将 url 跟 params 结合成新 url
 */
function transformUrl(config: TxiosRequestConfig): string {
  const { url, params } = config
  return recreateUrl(url, params)
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @returns {*}
 * @description 将 config 里的 data 进行转换，主要是将普通对象转换成 JSON 字符串
 * 这里主要用于 post 请求的数据处理
 */
function transformRequestData(config: TxiosRequestConfig): any {
  return transformRequest(config.data)
}

export default txios
