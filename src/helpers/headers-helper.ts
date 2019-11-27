import { isNormalObject, deepMerge } from './util-helper'
import { Method } from '../types/index'

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

/**
 *
 *
 * @export
 * @param {string} headers
 * @returns {*}
 * @description
 * 将 header 属性中的字符串
 * 'date: Fri, 05 Apr 2019 12:40:49 GMT
 *  etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
 * 转变成
 * {
 *  date: Fri, 05 Apr 2019 12:40:49 GMT
 *  etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
 * }
 * 对象
 */
export function parseHeaders(headers: string): any {
  const parser = Object.create(null)
  if (!headers) return parser

  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    // key 需要去掉空格以及转变成小写
    key = key.trim().toLowerCase()
    if (!key) return
    if (value) value = value.trim()
    parser[key] = value
  })

  return parser
}

/**
 *
 *
 * @export
 * @param {*} headers
 * @param {Method} method
 * @returns {*}
 * @description
 * 主要将
 * headers: {
 *   common: {
 *     Accept: 'application/json, text/plain'
 *   },
 *   post: {
 *     'Content-Type':'application/x-www-form-urlencoded'
 *   }
 * }
 * flatten 成一层
 * headers: {
 *   Accept: 'application/json, text/plain'
 *   'Content-Type':'application/x-www-form-urlencoded'
 * }
 * common 中定义的 header 字段都要做提取值
 * 对于 post 之类的需要对请求的方法做判断提取值
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return

  console.log('headers = ', headers)

  // 将全部的属性(common, post 等)从 headers.common/headers.post 中取出
  // 然后拷贝到 headers 中
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const propsToDelete = [
    'delete',
    'get',
    'head',
    'options',
    'post',
    'put',
    'patch',
    'common'
  ]
  // 再将这些属性删除(common, post 等)
  propsToDelete.forEach(prop => {
    delete headers[prop]
  })

  return headers
}
