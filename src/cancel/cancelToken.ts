import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}
/**
 *
 *
 * @export
 * @class CancelToken
 */
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    // this.promise 用来表示一个 pending 状态的 Promise 对象
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    // 执行传入的 executor 函数, 传的参数是一个 cancel 函数
    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      // 此时 this.promise 会从 pending 状态变为 resolved 状态
      // 便于外部可以做 xxx.promise.then 的调用
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })

    return { cancel, token }
  }

  throwRequested(): void {
    if (this.reason) throw this.reason
  }
}
