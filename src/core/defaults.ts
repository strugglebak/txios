import { TxiosRequestConfig } from '../types/index'

// 默认配置定义
const defaults: TxiosRequestConfig = {
  method: 'get', // 默认请求方法
  timeout: 0, // 超时时间
  headers: {
    // headers 默认配置
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const methodsWithoutData = ['delete', 'get', 'head', 'options']
methodsWithoutData.forEach(method => {
  defaults.headers[method] = {}
})
const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// TODO
// 新配置添加

export default defaults
