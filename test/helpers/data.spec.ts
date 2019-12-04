import {
  transformRequest,
  transformResponse
} from '../../src/helpers/data-helper'
import { url } from 'inspector'

describe('helpers: data-helper', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data if NormalObject', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })

    test('should do nothing if data is not a NormalObject', () => {
      const a = new Date()
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transform response data to Object if data is a JSON string', () => {
      const a = '{"a":1}'
      expect(transformResponse(a)).toEqual({ a: 2 })
    })
    test('should do nothing if data is a string but no a JSON string', () => {
      const a = '{a:1}'
      expect(transformResponse(a)).toBe(a)
    })
    test('should do nothing if data is not a string', () => {
      const a = { a: 1 }
      expect(transformResponse(a)).toBe(a)
    })
  })
})
