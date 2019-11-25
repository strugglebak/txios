import {
  TxiosRequestConfig,
  TxiosPromise,
  Method,
  TxiosResponse,
  RejectedFn,
  ResolvedFn
} from '../types'

import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptor'

interface Interceptors {
  request: InterceptorManager<TxiosRequestConfig>
  response: InterceptorManager<TxiosResponse>
}

// 拦截器链式调用需要接口
interface PromiseChain {
  resolved: ResolvedFn | ((config: TxiosRequestConfig) => TxiosPromise)
  rejected?: RejectedFn
}

/**
 *
 *
 * @export
 * @class TxiosCore
 * @description TxiosCore 类是实现接口定义的公共方法
 * 这里本质上是对 dispatchRequest.ts 做了一层封装
 */
export default class TxiosCore {
  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<TxiosRequestConfig>(),
      response: new InterceptorManager<TxiosResponse>()
    }
  }

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

  request(url: any, config?: any): TxiosPromise {
    // 对传入两个参数的接口做了兼容处理
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }

    /**
     * 构建如下的 Promise 链
     * req           req                      res         res
     * ---     -->   ---      --> chain -->   ---    -->  ---
     * inter2        inter1                   inter1      inter2
     */
    const chain: PromiseChain[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor) // 插入到 chain 前面
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor) // 插入到 chain 后面
    })

    let promise = Promise.resolve(config)
    // 循环这个 chain 拿到每个拦截器对象
    // 将其 resolved 以及 rejected 函数添加到 promise.then 的参数中
    // 通过 Promise 链式调用方式，可实现拦截器一层一层链式调用效果
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
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
