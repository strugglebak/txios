const toString = Object.prototype.toString

// 用户自定义的类型保护 parameterName is Type
// 这种形式能够简化多次使用类型断言的场合(as 语法)
export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]'
}

export function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object'
}

// 这个是返回一个普通对象, 这个对象不是 Blob、BufferSource、FormData、ArrayBuffer 等类型
export function isNormalObject(value: any): value is Object {
  return toString.call(value) === '[object Object]'
}

// 辅助函数，混合对象, & 表示交叉类型
// 主要是把 from 里的属性拓展到 to 中(包括原型上的属性)
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}
