import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

/**
 *
 *
 * @export
 * @class InterceptorManager
 * @template T
 * @description 拦截管理器泛型类
 */
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  /**
   *
   *
   * @param {ResolvedFn<T>} resolved
   * @param {RejectedFn} [rejected]
   * @returns {number} id 用于删除
   * @memberof InterceptorManager
   * @description 添加拦截器到 interceptors 中
   */
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({ resolved, rejected })
    return this.interceptors.length - 1
  }

  /**
   *
   *
   * @param {(interceptor: Interceptor<T>) => void} fn
   * @memberof InterceptorManager
   * @description 遍历 interceptors 函数
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      interceptor && fn(interceptor)
    })
  }

  /**
   *
   *
   * @param {number} id
   * @memberof InterceptorManager
   * @description 删除对应的拦截器
   */
  eject(id: number): void {
    if (this.interceptors[id]) this.interceptors[id] = null
  }
}
