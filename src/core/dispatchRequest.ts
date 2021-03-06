import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from '../types'
import xhr from './xhr'
import { recreateUrl, isAbsoluteUrl, mergeUrl } from '../helpers/url-helper'
import { flattenHeaders } from '../helpers/headers-helper'
import transform from './transform'

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @returns {TxiosPromise}
 * @description 封装的 dispatchRequest 方法, 用 TypeScript 实现, 此为库函数入口
 */
export function dispatchRequest(config: TxiosRequestConfig): TxiosPromise {
  checkIfCancellationRequested(config) // 检查 cancelToken 是否被使用过
  handleConfig(config)
  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      // 请求失败需要将响应数据转成 JSON 格式
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
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
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @returns {string}
 * @description 将 url 跟 params 结合成新 url
 */
export function transformUrl(config: TxiosRequestConfig): string {
  const { url, params, paramsSerializer, baseUrl } = config
  let newUrl = url
  if (baseUrl && !isAbsoluteUrl(url!)) {
    newUrl = mergeUrl(baseUrl, url)
  }
  return recreateUrl(newUrl!, params, paramsSerializer)
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
  return transform(config.data, config.headers, config.transformRequest)
}

/**
 *
 *
 * @param {TxiosResponse} res
 * @returns {TxiosResponse}
 * @description 对 response 中的 data 属性做处理
 */
function transformResponseData(res: TxiosResponse): TxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

/**
 *
 *
 * @param {TxiosRequestConfig} config
 */
function checkIfCancellationRequested(config: TxiosRequestConfig): void {
  if (config.cancelToken) config.cancelToken.throwRequested()
}

export default dispatchRequest
