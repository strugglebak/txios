import { isNormalObject } from './util-helper'

/**
 *
 *
 * @export
 * @param {*} data
 * @returns {*}
 * @description
 * 用于 request 中
 * 如果是普通对象，则转换成 JSON 对象
 * 如果不是普通对象，则直接 return 不做处理
 */
export function transformRequest(data: any): any {
  if (isNormalObject(data)) return JSON.stringify(data)
  return data
}

/**
 *
 *
 * @export
 * @param {*} data
 * @returns {*}
 * @description
 * 用于 response 中
 * 如果服务端返回的数据是 string 类型
 * 则将其转换成 JSON 对象
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = data && JSON.parse(data)
    } catch (error) {
      // TODO
      console.log(error)
    }
  }
  return data
}
