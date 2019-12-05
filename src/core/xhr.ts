import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers-helper'
import { createError } from '../helpers/error-helper'
import { isUrlSameOrigin } from '../helpers/url-helper'
import cookie from '../helpers/cookie-helper'
import { isFormData } from '../helpers/util-helper'

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
      method,
      headers = {},
      data = null,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    // 开始封装 xhr
    const request = new XMLHttpRequest()
    request.open(method!.toUpperCase(), url!, true)

    configureRequest()
    bindEvents()
    processHeaders()
    processCancel()

    request.send(data)

    function configureRequest(): void {
      // responseType 不为空的话，需要将该属性添加到 request 中去
      if (responseType) request.responseType = responseType
      // timeout 不为空的话，需要将该属性添加到 request 中去
      if (timeout) request.timeout = timeout
      // 设置 withCredentials
      if (withCredentials) request.withCredentials = true
    }

    function bindEvents(): void {
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

      // 设置异常错误处理回调
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

      // 设置监控下载和上传进度回调
      if (onDownloadProgress) request.onprogress = onDownloadProgress
      if (onUploadProgress) request.upload.onprogress = onUploadProgress
    }

    function handleResponse(response: TxiosResponse): void {
      // 若没有配置 validateStatus 或 validateStatus 返回 true
      // 都认为合法
      !validateStatus || validateStatus(response.status)
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

    function processHeaders(): void {
      // 如果用户配置了 auth 属性，则在 headers 中添加 Authorization 属性
      if (auth) {
        headers['Authorization'] =
          'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      // 如果请求的数据是 FormData 类型，则应该主动函数 headers 中的 content-Type 字段
      // 让浏览器自动根据数据类型设置 Content-Type
      if (isFormData(data)) delete headers['Content-Type']

      // 设置 cookie
      // 1. 若 withCredentials = true | 同域请求，在 headers 中添加 xsrf 相关字段
      // 2. 判断成功,则从 cookie 中读取 xsrf 的 token
      // 3. 若能读到，则将其添加到请求 headers 的 xsrf 相关字段中
      if ((withCredentials || isUrlSameOrigin(url!)) && xsrfCookieName) {
        const token = cookie.getToken(xsrfCookieName)
        if (token) headers[xsrfHeaderName!] = token
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
    }

    function processCancel(): void {
      // 设置取消请求
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(() => {
            // TODO
          })
      }
    }
  })
}
