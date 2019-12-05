import {
  recreateUrl,
  mergeUrl,
  isUrlSameOrigin,
  isAbsoluteUrl
} from '../../src/helpers/url-helper'

describe('helpers: url-helper', () => {
  describe('recreateUrl', () => {
    test('should support null params', () => {
      expect(recreateUrl('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(recreateUrl('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      expect(recreateUrl('/foo', { foo: 'bar', bar: null })).toBe(
        '/foo?foo=bar'
      )
    })

    test('should ignore if the only param value is null', () => {
      expect(recreateUrl('/foo', { foo: null })).toBe('/foo')
    })

    test('should support object params', () => {
      expect(recreateUrl('/foo', { foo: { bar: 'bar' } })).toBe(
        '/foo?foo=' + encodeURI('{"bar":"bar"}')
      )
    })

    test('should support date params', () => {
      const date = new Date()
      expect(recreateUrl('/foo', { date })).toBe(
        '/foo?date=' + date.toISOString()
      )
    })

    test('should support array params', () => {
      expect(recreateUrl('/foo', { foo: ['bar', 'baz'] })).toBe(
        '/foo?foo[]=bar&foo[]=baz'
      )
    })

    test('should support special char params', () => {
      expect(recreateUrl('/foo', { foo: '@:$, ' })).toBe('/foo?foo=@:$,+')
    })

    test('should support existing params', () => {
      expect(recreateUrl('/foo?foo=bar', { bar: 'baz' })).toBe(
        '/foo?foo=bar&bar=baz'
      )
    })

    test('should support correct discard url hash mark', () => {
      expect(recreateUrl('/foo?foo=bar#hash', { bar: 'baz' })).toBe(
        '/foo?foo=bar&bar=baz'
      )
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(recreateUrl('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(recreateUrl('/foo', new URLSearchParams('bar=baz'))).toBe(
        '/foo?bar=baz'
      )
    })
  })

  describe('mergeUrl', () => {
    test('should should merge Url', () => {
      expect(mergeUrl('https://github.com/strugglebak', '/users')).toBe(
        'https://github.com/strugglebak/users'
      )
    })

    test('should remove duplicate slashes Url', () => {
      expect(mergeUrl('https://github.com/strugglebak/', '/users')).toBe(
        'https://github.com/strugglebak/users'
      )
    })

    test('should insert missing slash', () => {
      expect(mergeUrl('https://github.com/strugglebak', 'users')).toBe(
        'https://github.com/strugglebak/users'
      )
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(mergeUrl('https://github.com/strugglebak/users', '')).toBe(
        'https://github.com/strugglebak/users'
      )
    })

    test('should allow a single slash for relative url', () => {
      expect(mergeUrl('https://github.com/strugglebak/users', '/')).toBe(
        'https://github.com/strugglebak/users/'
      )
    })
  })

  describe('isUrlSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isUrlSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect different origin', () => {
      expect(isUrlSameOrigin('https://github.com/strugglebak')).toBeFalsy()
      expect(isUrlSameOrigin('http://' + window.location.href)).toBeFalsy()
    })
  })

  describe('isAbsoluteUrl', () => {
    test('should detect absolute url', () => {
      expect(isAbsoluteUrl('https://github.com')).toBeTruthy()
      expect(isAbsoluteUrl('//github.com')).toBeTruthy()
    })

    test('should detect relative url', () => {
      expect(isAbsoluteUrl('/user')).toBeFalsy()
    })
  })
})
