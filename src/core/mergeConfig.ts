import { TxiosRequestConfig } from '../types'
import { isNormalObject, deepMerge } from '../helpers/util-helper'

const policies = Object.create(null)

// 对于 config 中的 url params data 字段
// 只接受自定义配置
const policyKeysFromCustomValue = ['url', 'params', 'data']
policyKeysFromCustomValue.forEach(key => {
  policies[key] = onlyCustomPolicy
})

// 对于 headers 中的字段
// 合并复杂对象(深拷贝)
const policyKeysDeepMerge = ['headers']
policyKeysDeepMerge.forEach(key => {
  policies[key] = deepMergePolicy
})

/**
 *
 *
 * @export
 * @param {TxiosRequestConfig} toConfig
 * @param {TxiosRequestConfig} [fromConfig]
 * @returns {TxiosRequestConfig}
 * @description 合并默认配置和自定义配置
 */
export default function mergeConfig(
  defaultConfig: TxiosRequestConfig,
  customConfig?: TxiosRequestConfig
): TxiosRequestConfig {
  if (!customConfig) customConfig = {}

  const finalConfig = Object.create(null)

  // 先将自定义配置拷贝到 finalConfig 中
  for (let key in customConfig) mergeField(key)

  // 然后将自定义配置中没有的配置拷贝到 finalConfig 中
  for (let key in defaultConfig) {
    if (!customConfig[key]) mergeField(key)
  }

  // 根据不同字段合并会对应不同合并策略
  function mergeField(key: string): void {
    // 这里的 policy 指向的是一个函数
    // 如果对应字段的需要处理的 merge 策略函数
    // 不存在就用默认的
    const policy = policies[key] || defaultPolicy
    // merge 完成后赋值给 finalConfig
    finalConfig[key] = policy(defaultConfig[key], customConfig![key])
  }

  return finalConfig
}

// 默认合并策略
// 如果自定义配置中有某个属性，就采用自定义的，反之采用默认的
function defaultPolicy(defaultValue: any, customValue: any): any {
  return typeof customValue !== 'undefined' ? customValue : defaultValue
}

// 只接受自定义的配置策略
// 对于 url params data 的合并策略
function onlyCustomPolicy(defaultValue: any, customValue: any): any {
  if (typeof customValue !== 'undefined') return customValue
}

// 复杂对象合并策略
function deepMergePolicy(defaultValue: any, customValue: any): any {
  // 优先检测自定义配置
  if (isNormalObject(customValue)) {
    // 自定义配置 value 是普通对象
    return deepMerge(defaultValue, customValue)
  } else if (typeof customValue !== 'undefined') {
    // 自定义配置 value 是其他对象
    return customValue
  } else if (isNormalObject(defaultValue)) {
    // 默认配置是普通对象
    return deepMerge(defaultValue)
  } else {
    // 默认配置是其他对象
    return defaultValue
  }
}
