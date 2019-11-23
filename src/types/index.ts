/**
 *
 *
 * @export
 * @interface TxiosRequestConfig
 * @param {string} url  请求地址，必选属性
 * @param {Method} method  请求 HTTP 方法, 可选属性
 * @param {any} params  需要拼接到 url 的 query string 中的数据, 可选属性
 * @param {any} data  请求数据, 可选属性
 * @param {XMLHttpRequestResponseType} responseType 响应数据类型，可以是 ""|arrayBuffer|blob|document|json|text
 */
export interface TxiosRequestConfig {
  url: string
  method?: Method
  headers?: any
  params?: any
  data?: any
  responseType?: XMLHttpRequestResponseType
}

/**
 *
 *
 * @export
 * @interface TxiosResponse response 对象
 * @param {any} data 服务端返回的数据
 * @param {number} status HTTP 状态码
 * @param {string} statusText 状态消息
 * @param {any} headers 响应头
 * @param {TxiosRequestConfig} config 请求配置对象
 * @param {request} request 请求对象 XMLHttpRequest 对象实例 request
 */
export interface TxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: TxiosRequestConfig
  request: any
}

/**
 *
 *
 * @export
 * @interface TxiosPromise
 * @extends {Promise<TxiosResponse>}
 * @description txios 函数返回的是一个 Promise 对象
 * 所以定义这个接口，它继承于泛型接口 Promise<TxiosResponse>
 * 当 txios 返回 TxiosPromise 类型时，resolve 函数中的参数
 * 就是一个 TxiosResponse 类型
 */
export interface TxiosPromise extends Promise<TxiosResponse> {}

/**
 *
 *
 * @export
 * @type Method
 * @description 封装的 HTTP 请求方法
 */
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'patch'
  | 'PATCH'
