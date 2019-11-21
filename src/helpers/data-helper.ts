import { isNormalObject } from './util-helper'

export function transformRequest(data: any): any {
  if (isNormalObject(data)) return JSON.stringify(data)
  return data
}
