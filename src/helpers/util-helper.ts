const toString = Object.prototype.toString

/**
 *
 *
 * @export
 * @param {*} value
 * @returns {value is Date}
 * @description
 * 用户自定义的类型保护 parameterName is Type
 * 这种形式能够简化多次使用类型断言的场合(as 语法)
 */
export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]'
}

/**
 *
 *
 * @export
 * @param {*} value
 * @returns {value is Object}
 * @description
 * 这个是返回一个普通对象, 这个对象不是 Blob、BufferSource、FormData、ArrayBuffer 等类型
 */
export function isNormalObject(value: any): value is Object {
  return toString.call(value) === '[object Object]'
}

/**
 *
 *
 * @export
 * @template T
 * @template U
 * @param {T} to
 * @param {U} from
 * @returns {(T & U)}
 * @description
 * 辅助函数，混合对象, & 表示交叉类型
 * 主要是把 from 里的属性拓展到 to 中(包括原型上的属性)
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}

/**
 *
 *
 * @export
 * @param {...any[]} objects
 * @returns {*}
 * @description
 *
 * 简单深拷贝
 * 这个函数主要是对合并配置项中的 headers 属性做处理, 即将
 * headers: {
 *   common: {
 *     text: {
 *       yyy: {
 *         foo: 'bar'
 *       },
 *       xxx: new Blob(),
 *     },
 *     Accept: 'application/json, text/plain',
 *   }
 *  }
 *  以及
 * headers: {
 *   test: '111'
 * }
 * 合并成
 * headers: {
 *   common: {
 *     text: {
 *       yyy: {
 *         foo: 'bar'
 *       },
 *       xxx: new Blob(),
 *     },
 *     Accept: 'application/json, text/plain',
 *   },
 *   test: '111'
 * }
 * 深度优先递归遍历
 */
export function deepMerge(...objects: any[]): any {
  const result = Object.create(null)
  // defaultValue, customValue...
  objects.forEach(object => {
    if (!object) return

    Object.keys(object).forEach(key => {
      const value = object[key]
      if (isNormalObject(value)) {
        if (isNormalObject(result[key])) {
          // result[key] 有值了说明上一个 headers 已经拷贝完毕
          // 准备拷贝下一个 headers 的属性
          result[key] = deepMerge(result[key], value)
        } else {
          // result[key] 无值了说明上一个 headers 还没拷贝完
          // 继续拷贝到这个空对象中
          result[key] = deepMerge({}, value)
        }
      } else {
        // 主要不是普通对象的直接赋值即可
        result[key] = value
      }
    })
  })

  return result
}

/**
 *
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 * @description 判断是否是 FormData 类型的数据
 */
export function isFormData(value: any): boolean {
  return typeof value !== 'undefined' && value instanceof FormData
}

/**
 *
 *
 * @export
 * @param {*} value
 * @returns {value is URLSearchParams}
 * @description 判断是否是 URLSearchParams 类型的数据
 */
export function isUrlSearchParams(value: any): value is URLSearchParams {
  return typeof value !== 'undefined' && value instanceof URLSearchParams
}
