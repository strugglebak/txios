import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from './types'
import { parseHeaders } from './helpers/headers-helper'
import { createError } from './helpers/error-helper'

/**
 *
 *
 * @export
 * @param {TxiosRequestConfig} config
 * @returns {TxiosPromise}
 * @description 利用 XMLHttpRequest 发送请求
 */
export default function xhr(config: TxiosRequestConfig): TxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      headers,
      data = null,
      responseType,
      timeout
    } = config

    // 开始封装 xhr
    const request = new XMLHttpRequest()
    // responseType 不为空的话，需要将该属性添加到 request 中去
    if (responseType) request.responseType = responseType
    // timeout 不为空的话，需要将该属性添加到 request 中去
    if (timeout) request.timeout = timeout
    request.open(method.toUpperCase(), url, true)

    // 设置获取响应数据回调
    request.onreadystatechange = () => {
      if (request.readyState !== 4) return
      if (request.status === 0) return

      const responseData =
        responseType && responseType !== 'text'
          ? request.response
          : request.responseText
      const responseStatus = request.status
      const responseStatusText = request.statusText
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const response: TxiosResponse = {
        data: responseData,
        status: responseStatus,
        statusText: responseStatusText,
        headers: responseHeaders,
        config,
        request
      }
      // 构造 TxiosResponse 类型对象，并将其 resolve 出去
      handleResponse(response)
    }
    function handleResponse(response: TxiosResponse) {
      response.status >= 200 && response.status < 300
        ? resolve(response)
        : reject(
            createError(
              `Request failed with status code ${response.status}`,
              config,
              null,
              request,
              response
            )
          )
    }

    // 设置异常错误处理
    request.onerror = () => {
      reject(createError('Network Error', config, 'ECONNABORTED', request))
    }
    request.ontimeout = () => {
      reject(
        createError(
          `Timeout of ${timeout}ms exceeded`,
          config,
          'ECONNABORTED',
          request
        )
      )
    }

    // 设置 headers
    Object.keys(headers).forEach(name => {
      // 当传入的 data 为空时，设置 content-type 没有意义，可以删掉它
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
