import { TxiosRequestConfig } from './types'
import xhr from './xhr'

/**
 *
 *
 * @param {TxiosRequestConfig} config
 * @description 封装的 axios 方法, 用 TypeScript 实现, 此为库函数入口
 */
function txios(config: TxiosRequestConfig) {
  xhr(config)
}

export default txios
