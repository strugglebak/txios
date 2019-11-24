import { TxiosRequestConfig, TxiosPromise, Method } from '../types'

import dispatchRequest from './dispatchRequest'

/**
 *
 *
 * @export
 * @class TxiosCore
 * @description TxiosCore 类是实现接口定义的公共方法
 * 这里本质上是对 dispatchRequest.ts 做了一层封装
 */
export default class TxiosCore {
  get(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }
  options(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }
  post(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  request(config: TxiosRequestConfig): TxiosPromise {
    return dispatchRequest(config)
  }

  // 用于 url 传参的场合
  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: TxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }
  // 用于消息体传参的场合
  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: TxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
