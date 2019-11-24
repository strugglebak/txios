import { TxiosInstance } from './types'
import TxiosCore from './core/txios-core'
import { extend } from './helpers/util-helper'

/**
 *
 *
 * @returns {TxiosInstance}
 * @description 使用工厂模式去创建一个 txios 混合对象
 * instance 本身是个函数，同时又拥有 TxiosCore 类的所有原型和实例属性
 * 直接调用 axios 方法相当于执行了 TxiosCore 类的 request 方法发送请求
 */
function createInstance(): TxiosInstance {
  const context = new TxiosCore()
  const instance = TxiosCore.prototype.request.bind(context)

  extend(instance, context)

  return instance as TxiosInstance
}

const txios = createInstance()

export default txios
