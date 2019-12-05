import txios from '../src/index'
import { getAjaxRequest } from './helper'

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should use default common headers', () => {
    const headers = txios.defaults.headers.common
    txios('/foo')
    return getAjaxRequest().then(req => {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(req.requestHeaders[key]).toEqual(headers[key])
        }
      }
    })
  })

  test('should add extra headers for post', () => {
    txios.post('/foo', 'fizz=buzz')

    return getAjaxRequest().then(req => {
      testHeaderValue(
        req.requestHeaders,
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    })
  })

  test('should use application/json when posting an object', () => {
    txios.post('/foo/bar', { foo: 'foo', bar: 'bar' })

    return getAjaxRequest().then(req => {
      testHeaderValue(
        req.requestHeaders,
        'Content-Type',
        'application/json;charset=utf-8'
      )
    })
  })

  test('should remove content-type if data is empty', () => {
    txios.post('/foo')

    return getAjaxRequest().then(req => {
      testHeaderValue(req.requestHeaders, 'Content-Type', undefined)
    })
  })

  test('should preserve content-type if data is false', () => {
    txios.post('/foo', false)

    return getAjaxRequest().then(req => {
      testHeaderValue(
        req.requestHeaders,
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    })
  })

  test('should remove content-type if data is FormData', () => {
    const data = new FormData()
    data.append('foo', 'bar')
    txios.post('/foo', data)
    return getAjaxRequest().then(req => {
      testHeaderValue(req.requestHeaders, 'Content-Type', undefined)
    })
  })
})

/**
 *
 *
 * @param {*} headers
 * @param {string} key
 * @param {string} [value]
 * @description 用于测试 headers 是否存在某个 header name 下的某个值
 */
function testHeaderValue(headers: any, key: string, value?: string): void {
  let found = false

  for (let k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      found = true
      expect(headers[k]).toBe(value)
      break
    }
  }

  if (!found) {
    if (typeof value === 'undefined') {
      expect(headers.hasOwnProperty(key)).toBeFalsy()
    } else {
      throw new Error(key + 'was not found in headers')
    }
  }
}
