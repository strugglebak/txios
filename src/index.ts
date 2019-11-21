import { TxiosRequestConfig } from './types'
import xhr from './xhr'
import { recreateUrl } from './helpers/url-helper'

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @description 封装的 axios 方法, 用 TypeScript 实现, 此为库函数入口
 */
function txios(config: TxiosRequestConfig): void {
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

export default txios
