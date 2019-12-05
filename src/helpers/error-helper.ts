import { TxiosRequestConfig, TxiosResponse } from '../types'

/**
 *
 *
 * @export
 * @class TxiosError
 * @extends {Error}
 * @description 实现 TxiosError 类，继承于 Error 类
 */
export class TxiosError extends Error {
  config: TxiosRequestConfig
  code?: string | null
  request?: any
  response?: TxiosResponse
  isTxiosError: boolean

  /* istanbul ignore next */
  constructor(
    message: string,
    config: TxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: TxiosResponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isTxiosError = true

    // ts 继承失效的坑，必须要加这个
    Object.setPrototypeOf(this, TxiosError.prototype)
  }
}

/**
 *
 *
 * @export
 * @param {string} message
 * @param {TxiosRequestConfig} config
 * @param {(string | null)} [code]
 * @param {*} [request]
 * @param {TxiosResponse} [response]
 * @returns {TxiosError}
 * @description 暴露这个工厂方法是为了方便使用
 * 因为这里不需要关系内部构造器是怎么生成的，只需要调用它生成实例就可以
 * 构造函数与创建者分离，符合开放封闭原则
 */
export function createError(
  message: string,
  config: TxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: TxiosResponse
): TxiosError {
  const error = new TxiosError(message, config, code, request, response)
  return error
}
