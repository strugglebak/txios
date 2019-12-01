/**
 *
 *
 * @export
 * @interface Txios
 * @template T
 * @description Txios 的扩展接口，Txios 本身也是个混合对象
 * 因为其本身是一个方法，又有很多方法属性
 */
export interface Txios {
  get<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  delete<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  head<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  options<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  post<T = any>(
    url: string,
    data?: any,
    config?: TxiosRequestConfig
  ): TxiosPromise<T>
  put<T = any>(
    url: string,
    data?: any,
    config?: TxiosRequestConfig
  ): TxiosPromise<T>
  patch<T = any>(
    url: string,
    data?: any,
    config?: TxiosRequestConfig
  ): TxiosPromise<T>

  request<T = any>(config: TxiosRequestConfig): TxiosPromise<T>
}

/**
 *
 *
 * @export
 * @interface TxiosInstance
 * @template T
 * @extends {Txios}
 * @description 混合类型接口
 * 这样写的好处是调用时可以直接使用 TxiosInstance(config) 的方式传参
 */
export interface TxiosInstance extends Txios {
  <T = any>(config: TxiosRequestConfig): TxiosPromise<T>
  <T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
}

/**
 *
 *
 * @export
 * @interface TxiosStatic
 * @extends {TxiosInstance}
 * @description 这是个静态方法拓展
 * 主要是因为 Txios 这个单例修改默认配置会影响所有的请求
 * 所以这里提供一个 create 的接口来 产生一个新的 txios 实例将这些配置隔离开
 */
export interface TxiosStatic extends TxiosInstance {
  create(config?: TxiosRequestConfig): TxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

/**
 *
 *
 * @export
 * @interface TxiosRequestConfig
 * @param {string} url  请求地址，可选属性
 * @param {Method} method  请求 HTTP 方法, 可选属性
 * @param {any} params  需要拼接到 url 的 query string 中的数据, 可选属性
 * @param {any} data  请求数据, 可选属性
 * @param {XMLHttpRequestResponseType} responseType  响应数据类型，可以是 ""|arrayBuffer|blob|document|json|text
 * @param {number} timeout  超时时间
 * @param {TxiosTransformer | TxiosTransformer[]} transformRequest 请求配置属性
 * @param {TxiosTransformer | TxiosTransformer[]} transformResponse 响应配置属性
 * @param {CancelToken} cancelToken 取消类型
 * @param {boolean} withCredentials xhr 对象的 withCredentials
 * @param {string} xsrfCookieName 存储 token 的 cookie 名称
 * @param {string} xsrfHeaderName 请求 Headers 中 token 对应的 header 名称
 */
export interface TxiosRequestConfig {
  url?: string
  method?: Method
  headers?: any
  params?: any
  data?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  [propName: string]: any // 字符串索引签名, 因为遍历过程会使用 xxx[key] 这种方式访问
  transformRequest?: TxiosTransformer | TxiosTransformer[]
  transformResponse?: TxiosTransformer | TxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
}

/**
 *
 *
 * @export
 * @interface CancelToken
 * @description 在外部执行 cancel 函数时，能够执行 xhr.abort 方法取消请求
 * 这个时候就用 promise 实现，在 then 函数中实现该需求
 * 实例类型接口定义
 */
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwRequested(): void // 如果请求已经使用过 cancelToken，那么只需要抛异常，请求就不必发送
}
/**
 *
 *
 * @export
 * @interface Canceler
 * @description cancel 的函数接口
 * 取消方法接口定义
 */
export interface Canceler {
  (message?: string): void
}
/**
 *
 *
 * @export
 * @interface CancelExecutor
 * @description CancelToken 的构造函数的参数支持传的一个 executor 方法
 * 该方法能拿到一个 canceler ，即取消函数，供外部变量赋值后调用
 * CancelToken 类构造函数参数接口定义
 */
export interface CancelExecutor {
  (cancel: Canceler): void
}

/**
 *
 *
 * @export
 * @interface CancelTokenStatic
 * @description CancelToken 拓展的静态接口
 */
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

/**
 *
 *
 * @export
 * @interface CancelTokenSource
 * @description
 */
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

/**
 *
 *
 * @export
 * @interface Cancel
 * @description 实例类型接口
 */
export interface Cancel {
  message?: string
}
/**
 *
 *
 * @export
 * @interface CancelStatic
 * @description 类类型接口
 */
export interface CancelStatic {
  new (message?: string): Cancel
}

/**
 *
 *
 * @export
 * @interface TxiosTransformer
 * @description 请求响应配置接口
 */
export interface TxiosTransformer {
  (data: any, headers?: any): any
}

/**
 *
 *
 * @export
 * @interface TxiosResponse response 对象
 * @template T
 * @param {T} data 服务端返回的数据
 * @param {number} status HTTP 状态码
 * @param {string} statusText 状态消息
 * @param {any} headers 响应头
 * @param {TxiosRequestConfig} config 请求配置对象
 * @param {request} request 请求对象 XMLHttpRequest 对象实例 request
 */
export interface TxiosResponse<T = any> {
  data: T
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
 * @template T
 * @extends {Promise<TxiosResponse>}
 * @description txios 函数返回的是一个 Promise 对象
 * 所以定义这个接口，它继承于泛型接口 Promise<TxiosResponse>
 * 当 txios 返回 TxiosPromise 类型时，resolve 函数中的参数
 * 就是一个 TxiosResponse 类型
 */
export interface TxiosPromise<T = any> extends Promise<TxiosResponse<T>> {}

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
 * @interface TxiosInterceptorManager
 * @template T
 * @description
 *
 * 这个拦截器管理对象对外接口
 *
 *                           -- request -- use(resolve, reject)
 *                          /
 * axios -- interceptors --
 *                          \
 *                           -- response -- use(resolve, reject)
 *
 * 对于 resolve 参数
 * request 里面就是 TxiosRequestConfig
 * response 里面就是 TxiosResponse
 * 所以这里用泛型来实现
 *
 * eject 表示删除拦截器
 */
export interface TxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}
export interface ResolvedFn<T = any> {
  (value: T): T | Promise<T>
}
export interface RejectedFn {
  (error: any): any
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
