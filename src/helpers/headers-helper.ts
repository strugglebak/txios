import { isNormalObject } from './util-helper'

/**
 *
 *
 * @export
 * @param {*} headers
 * @param {*} data
 * @returns {*}
 * @description 为 header 设置 content-type 头
 */
export function handleHeaders(headers: any, data: any): any {
  // 将用户输入的类似 'content-type' 或 'Content-type'
  // 转化成 'Content-Type'
  standardizeHeaderName(headers, 'Content-Type')

  if (isNormalObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

/**
 *
 *
 * @param {*} headers header 对象
 * @param {string} headerPropertyName header 属性名
 * @description 因为请求 header 的属性大小写不敏感
 * 所以这里需要对传入的 header 属性名进行规范化
 */
function standardizeHeaderName(headers: any, headerPropertyName: string): void {
  if (!headers) return

  Object.keys(headers).forEach(name => {
    if (
      name !== headerPropertyName &&
      name.toUpperCase() === headerPropertyName.toUpperCase()
    ) {
      headers[headerPropertyName] = headers[name]
      delete headers[name]
    }
  })
}