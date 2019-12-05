import txios, { TxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'
import { deepMerge } from '../src/helpers/util-helper'

describe('defaults', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform request json', () => {
    expect(
      (txios.defaults.transformRequest as TxiosTransformer[])[0]({ foo: 'bar' })
    ).toBe('{"foo":"bar"}')
  })

  test('should do nothing to request string', () => {
    expect(
      (txios.defaults.transformRequest as TxiosTransformer[])[0]('foo=bar')
    ).toBe('foo=bar')
  })

  test('should transform response json', () => {
    const data = (txios.defaults.transformResponse as TxiosTransformer[])[0](
      '{"foo":"bar"}'
    )
    expect(typeof data).toBe('object')
    expect(data.foo).toBe('bar')
  })

  test('should do nothing to response string', () => {
    expect(
      (txios.defaults.transformResponse as TxiosTransformer[])[0]('foo=bar')
    ).toBe('foo=bar')
  })

  test('should use global defaults config', () => {
    txios('/foo')

    return getAjaxRequest().then(req => {
      expect(req.url).toBe('/foo')
    })
  })

  test('should use modified defaults config', () => {
    txios.defaults.baseUrl = 'https://github.com'
    txios('/foo')

    return getAjaxRequest().then(req => {
      expect(req.url).toBe('https://github.com/foo')
      delete txios.defaults.baseUrl
    })
  })

  test('should use default config for custom instance', () => {
    const instance = txios.create({
      xsrfCookieName: 'CUSTOM-XSRF-TOKEN',
      xsrfHeaderName: 'X-CUSTOM-XSRF-TOKEN'
    })
    document.cookie = instance.defaults.xsrfCookieName + '=foobarbaz'

    instance.get('/foo')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[instance.defaults.xsrfHeaderName!]).toBe(
        'foobarbaz'
      )
      document.cookie =
        instance.defaults.xsrfCookieName +
        '=;expires=' +
        new Date(Date.now() - 86400000).toUTCString()
    })
  })

  test('should use GET headers', () => {
    txios.defaults.headers.get['X-CUSTOM-HEADER'] = 'foo'
    txios.get('/foo')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete txios.defaults.headers.get['X-CUSTOM-HEADER']
    })
  })

  test('should use POST headers', () => {
    txios.defaults.headers.post['X-CUSTOM-HEADER'] = 'foo'
    txios.post('/foo', {})

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete txios.defaults.headers.post['X-CUSTOM-HEADER']
    })
  })

  test('should use header config', () => {
    const instance = txios.create({
      headers: {
        common: { 'X-COMMON-HEADER': 'commonHeaderValue' },
        get: { 'X-GET-HEADER': 'getHeaderValue' },
        post: { 'X-POST-HEADER': 'postHeaderValue' }
      }
    })

    instance.get('/foo', {
      headers: {
        'X-FOO-HEADER': 'fooHeaderValue',
        'X-BAR-HEADER': 'barHeaderValue'
      }
    })

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders).toEqual(
        deepMerge(txios.defaults.headers.common, txios.defaults.headers.get, {
          'X-COMMON-HEADER': 'commonHeaderValue',
          'X-GET-HEADER': 'getHeaderValue',
          'X-FOO-HEADER': 'fooHeaderValue',
          'X-BAR-HEADER': 'barHeaderValue'
        })
      )
    })
  })

  test('should be used by custom instance if set before instance created', () => {
    txios.defaults.baseUrl = 'http://example.org/'
    const instance = txios.create()

    instance.get('/foo')

    return getAjaxRequest().then(req => {
      expect(req.url).toBe('http://example.org/foo')
      delete txios.defaults.baseUrl
    })
  })

  test('should not be used by custom instance if set after instance created', () => {
    const instance = txios.create()
    txios.defaults.baseUrl = 'http://example.org/'

    instance.get('/foo')

    return getAjaxRequest().then(req => {
      expect(req.url).toBe('/foo')
    })
  })
})
