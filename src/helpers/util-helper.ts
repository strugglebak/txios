const toString = Object.prototype.toString

// 用户自定义的类型保护 parameterName is Type
// 这种形式能够简化多次使用类型断言的场合(as 语法)
export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]'
}

export function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object'
}
