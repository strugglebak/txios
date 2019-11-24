/**
 *
 *
 * @export
 * @interface TxiosRequestConfig
 * @param {string} url  请求地址，必选属性
 * @param {Method} method  请求 HTTP 方法, 可选属性
 * @param {any} params  需要拼接到 url 的 query string 中的数据, 可选属性
 * @param {any} data  请求数据, 可选属性
 * @param {XMLHttpRequestResponseType} responseType  响应数据类型，可以是 ""|arrayBuffer|blob|document|json|text
 * @param {number} timeout  超时时间
 */
export interface TxiosRequestConfig {
  url: string
  method?: Method
  headers?: any
  params?: any
  data?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
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
 * @interface TxiosError
 * @param {TxiosRequestConfig} config 请求对象配置
 * @param {string} code 错误代码
 * @param {any} request XMLHttpRequest 对象实例
 * @param {TxiosResponse} response 自定义响应对象
 * @param {boolean} isTxiosError 是否是 Txios Error
 * @extends {Error}
 * @description 这个是为了丰富对外提供的错误信息而设计出来的接口
 * 主要用于外部使用
 */
export interface TxiosError extends Error {
  config: TxiosRequestConfig
  code?: string
  request?: any
  response?: TxiosResponse
  isTxiosError: boolean
}

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
