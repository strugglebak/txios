import cookie from '../../src/helpers/cookie-helper'

describe('helpers: cookie', () => {
  test('should get token from cookies', () => {
    document.cookie = 'foo=bar'
    expect(cookie.getToken('foo')).toBe('bar')
  })
  test('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=bar'
    expect(cookie.getToken('xxx')).toBe(null)
  })
})
