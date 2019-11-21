import { TxiosRequestConfig } from './types'

/**
 *
 *
 * @export
 * @param {TxiosRequestConfig} config
 * @description 利用 XMLHttpRequest 发送请求
 */
export default function xhr(config: TxiosRequestConfig): void {
  const { url, method = 'get', data = null } = config

  // 开始封装 xhr
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)

  request.send(data)
}
