/**
 *
 *
 * @export
 * @interface TxiosRequestConfig
 * @param {string} url  请求地址，必选属性
 * @param {Method} method  请求 HTTP 方法, 可选属性
 * @param {any} params  需要拼接到 url 的 query string 中的数据, 可选属性
 * @param {any} data  请求数据, 可选属性
 */
export interface TxiosRequestConfig {
  url: string
  method?: Method
  params?: any
  data?: any
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
