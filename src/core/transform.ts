import { TxiosTransformer } from '../types'

/**
 *
 *
 * @export
 * @param {*} data
 * @param {*} headers
 * @param {(TxiosTransformer | TxiosTransformer[])} [fns] 一个或多个转换函数
 * @returns {*}
 */
export default function transform(
  data: any,
  headers: any,
  fns?: TxiosTransformer | TxiosTransformer[]
): any {
  if (!fns) return data

  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
