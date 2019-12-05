import {
  parseHeaders,
  handleHeaders,
  flattenHeaders
} from '../../src/helpers/headers-helper'
import { peachpuff } from 'color-name'
import { head } from 'shelljs'

describe('helpers: headers-helper', () => {
  describe('parseHeaders', () => {
    test('should parse headers', () => {
      const parsed = parseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })

    test('should return empty object if headers is empty string', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })

  describe('handleHeaders', () => {
    test('should normalize Content-Type header name', () => {
      const headers: any = {
        'conTenT-Type': 'foo/bar',
        'Content-length': 1024
      }
      handleHeaders(headers, {})
      expect(headers['Content-Type']).toBe('foo/bar')
      expect(headers['conTenT-Type']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })

    test('should set Content-Type if not set and data is NormalObject', () => {
      const headers: any = {}
      handleHeaders(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should set not Content-Type if not set and data is not NormalObject', () => {
      const headers: any = {}
      handleHeaders(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(handleHeaders(undefined, {})).toBeUndefined()
      expect(handleHeaders(null, {})).toBeNull()
    })
  })

  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })

    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
      expect(flattenHeaders(null, 'post')).toBeNull()
    })
  })
})
