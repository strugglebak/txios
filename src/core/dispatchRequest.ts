import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from '../types'
import xhr from '../xhr'
import { recreateUrl } from '../helpers/url-helper'
import { transformRequest, transformResponse } from '../helpers/data-helper'
import { handleHeaders, flattenHeaders } from '../helpers/headers-helper'

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @returns {TxiosPromise}
 * @description 封装的 dispatchRequest 方法, 用 TypeScript 实现, 此为库函数入口
 */
export function dispatchRequest(config: TxiosRequestConfig): TxiosPromise {
  handleConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @description 处理 config 中的 url
 */
function handleConfig(config: TxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
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
  return recreateUrl(url!, params)
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

/**
 *
 *
 * @param {TxiosResponse} res
 * @returns {TxiosResponse}
 * @description 对 response 中的 data 属性做处理
 */
function transformResponseData(res: TxiosResponse): TxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @description 对 HTTP 请求头进行处理
 */
function transformHeaders(config: TxiosRequestConfig): void {
  const { headers = {}, data } = config
  return handleHeaders(headers, data)
}

export default dispatchRequest
