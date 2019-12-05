import txios from '../src/index'
import { getAjaxRequest } from './helper'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie =
      txios.defaults.xsrfCookieName +
      '=;expires=' +
      new Date(Date.now() - 86400000).toUTCString()
  })

  test('should not set xsrf header if cookie is null', () => {
    txios('/foo')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[txios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header if cookie is set', () => {
    document.cookie = txios.defaults.xsrfCookieName + '=12345'

    txios('/foo')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[txios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })

  test('should not set xsrf header for cross origin', () => {
    document.cookie = txios.defaults.xsrfCookieName + '=12345'

    txios('http://example.com/')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[txios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header for cross origin when using withCredentials', () => {
    document.cookie = txios.defaults.xsrfCookieName + '=12345'

    txios('http://example.com/', {
      withCredentials: true
    })

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[txios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })
})
