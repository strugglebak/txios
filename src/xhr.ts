import { TxiosRequestConfig } from './types'

/**
 *
 *
 * @export
 * @param {TxiosRequestConfig} config
 * @description 利用 XMLHttpRequest 发送请求
 */
export default function xhr(config: TxiosRequestConfig): void {
  const { url, method = 'get', headers, data = null } = config

  // 开始封装 xhr
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)

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
}
