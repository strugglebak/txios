import { TxiosRequestConfig, TxiosStatic } from './types'
import TxiosCore from './core/txios-core'
import { extend } from './helpers/util-helper'
import defaults from './core/defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

/**
 *
 *
 * @returns {TxiosInstance}
 * @description 使用工厂模式去创建一个 txios 混合对象
 * instance 本身是个函数，同时又拥有 TxiosCore 类的所有原型和实例属性
 * 直接调用 axios 方法相当于执行了 TxiosCore 类的 request 方法发送请求
 */
function createInstance(config: TxiosRequestConfig): TxiosStatic {
  const context = new TxiosCore(config)
  const instance = TxiosCore.prototype.request.bind(context)

  extend(instance, context)

  return instance as TxiosStatic
}

const txios = createInstance(defaults)

// 拓展 txios 的静态方法，供用户使用
txios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

txios.CancelToken = CancelToken
txios.Cancel = Cancel
txios.isCancel = isCancel

txios.all = function all(promises) {
  return Promise.all(promises)
}
txios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
txios.Txios = TxiosCore

export default txios
