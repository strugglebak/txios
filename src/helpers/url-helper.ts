import { isDate, isNormalObject, isUrlSearchParams } from './util-helper'

/**
 *
 *
 * @export
 * @param {string} url txios 传入的 url
 * @param {*} [params] txios 传入的 params 参数
 * @description 该函数的目的是把 params 拼接到 url 上重建 url 方便服务端解析
 * 这里主要需要处理几种情况
 * 1. 普通情况
 *    url = '/base/get' params = {a: 1, b: 2}
 *    最终结果是 /base/get?a=1&b=2
 *
 * 2. 参数值为数组
 *    url = '/base/get' params = foo: [1, 2]
 *    最终结果是 /base/get?foo[]=1&foo[]=2
 *
 * 3. 参数值为对象
 *    url = '/base/get' params = foo: {bar: 'baz'}
 *    最终结果是 /base/get?foo=%7B%22bar%22:%22baz%22%7D
 *
 * 4. 参数值为 Date 类型
 *    url = '/base/get' params = new Date()
 *    最终结果是 /base/get?date=2019-04-01T05:55:39.030Z
 *
 * 5. 需要支持特殊字符
 *    url = '/base/get' params = foo: '@:$'
 *    最终结果是 /base/get?foo=@:$+ (空格需要转换成 + 号)
 *
 * 6. 忽略空值
 *    url = '/base/get' params = foo: 'bar', baz: null
 *    最终结果是 /base/get?foo=bar
 *
 * 7. url 中的 hash 部分需要丢弃
 *    url = '/base/get#hash' params = foo: 'bar'
 *    最终结果是 /base/get?foo=bar
 *
 * 8. url 中已有参数需要保留
 *    url = '/base/get?foo=bar' params = bar: 'baz'
 *    最终结果是 /base/get?foo=bar&bar=baz
 */
export function recreateUrl(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
) {
  if (!params) return url

  let finalParams

  if (paramsSerializer) {
    finalParams = paramsSerializer(params)
  } else if (isUrlSearchParams(params)) {
    // 假如是 URLSearchParams 类型的 params 需要返回 toString 后的结果
    finalParams = params.toString()
  } else {
    const list: string[] = []
    Object.keys(params).forEach(key => {
      let value = params[key]
      // 空值忽略
      if (value === null || typeof value === 'undefined') return // 这里 return 是进入下次循环

      let values: string[]
      if (Array.isArray(value)) {
        // 参数值为数组
        key += '[]'
        values = value
      } else {
        // 不是数组就直接将参数作为 values 的元素
        values = [value]
      }

      values.forEach(val => {
        if (isDate(val)) {
          // 参数值为 Date 类型
          // 转换成类似 2019-04-01T05:55:39.030Z 类似这样的格式
          val = val.toISOString()
        } else if (isNormalObject(val)) {
          // 参数值为对象
          // 转换成字符串
          val = JSON.stringify(val)
        } // 将结果保存到 list 数组里
        // 同时要考虑到特殊字符，所以要对特殊字符进行转换
        list.push(`${encode(key)}=${encode(val)}`)
      })
    })
    // 处理 list 数组里面的参数
    finalParams = list.join('&')
  }

  if (finalParams) {
    // 去掉 url 中的哈希标记
    const endIndex = url.indexOf('#')
    if (endIndex !== -1) {
      url = url.slice(0, endIndex)
    }
    // 保留 url 中已存在的参数
    // 这里还要判断是不是有 "?" 这个字符串
    // 有就 url = url + '&' + 参数
    // 没有 url = url + '?' + 参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + finalParams
  }

  return url
}

/**
 *
 *
 * @param {string} value
 * @returns {string}
 * @description 将特殊字符编码成正确的字符
 */
function encode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

interface UrlOrigin {
  protocol: string
  host: string
  port: string
}
const urlParsingNode = document.createElement('a')
function resolveUrl(url: string): UrlOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host, port } = urlParsingNode
  return { protocol, host, port }
}
const currentOrigin = resolveUrl(window.location.href)
/**
 *
 *
 * @export
 * @param {string} requestUrl
 * @returns {boolean}
 * @description 判断请求的 url 是否同源
 */
export function isUrlSameOrigin(requestUrl: string): boolean {
  const parseOrigin = resolveUrl(requestUrl)
  return (
    parseOrigin.protocol === currentOrigin.protocol &&
    parseOrigin.host === currentOrigin.host &&
    parseOrigin.port === currentOrigin.port
  )
}

/**
 *
 *
 * @export
 * @param {string} url
 * @returns {boolean}
 * @description 判断是否是绝对路径
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 *
 *
 * @export
 * @param {string} baseUrl
 * @param {string} [relativeUrl]
 * @returns {string}
 * @description 合并 url，比如合并 https://github.com/api 和 /get
 */
export function mergeUrl(baseUrl: string, relativeUrl?: string): string {
  return relativeUrl
    ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '')
    : baseUrl
}
