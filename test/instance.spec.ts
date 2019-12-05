import txios, { TxiosRequestConfig, TxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should make a http request without verb helper', () => {
    const instance = txios.create()
    instance('/foo')
    return getAjaxRequest().then(req => {
      expect(req.url).toBe('/foo')
    })
  })

  test('should make a get request', () => {
    const instance = txios.create()
    instance.get('/foo')
    return getAjaxRequest().then(req => {
      expect(req.url).toBe('/foo')
      expect(req.method).toBe('GET')
    })
  })

  test('should make a post request', () => {
    const instance = txios.create()
    instance.post('/foo')
    return getAjaxRequest().then(req => {
      expect(req.method).toBe('POST')
    })
  })

  test('should make a put request', () => {
    const instance = txios.create()
    instance.put('/foo')
    return getAjaxRequest().then(req => {
      expect(req.method).toBe('PUT')
    })
  })

  test('should make a patch request', () => {
    const instance = txios.create()
    instance.patch('/foo')
    return getAjaxRequest().then(req => {
      expect(req.method).toBe('PATCH')
    })
  })

  test('should make a options request', () => {
    const instance = txios.create()
    instance.options('/foo')
    return getAjaxRequest().then(req => {
      expect(req.method).toBe('OPTIONS')
    })
  })

  test('should make a delete request', () => {
    const instance = txios.create()
    instance.delete('/foo')
    return getAjaxRequest().then(req => {
      expect(req.method).toBe('DELETE')
    })
  })

  test('should make a head request', () => {
    const instance = txios.create()
    instance.head('/foo')
    return getAjaxRequest().then(req => {
      expect(req.method).toBe('HEAD')
    })
  })

  test('should use instance options', () => {
    const instance = txios.create({ timeout: 1000 })
    instance.get('/foo')
    return getAjaxRequest().then(req => {
      expect(req.timeout).toBe(1000)
    })
  })

  test('should have defaults.headers', () => {
    const instance = txios.create({ baseUrl: 'https://github.com' })
    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })

  test('should have interceptors on the instance', done => {
    txios.interceptors.request.use(config => {
      config.timeout = 2000
      return config
    })

    const instance = txios.create()
    instance.interceptors.request.use(config => {
      config.withCredentials = true
      return config
    })

    let response: TxiosResponse
    // tslint:disable-next-line: no-floating-promises
    instance.get('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200 })

      setTimeout(() => {
        expect(response.config.timeout).toEqual(0)
        expect(response.config.withCredentials).toEqual(true)

        done()
      }, 100)
    })
  })

  test('should get the computed uri', () => {
    const fakeConfig: TxiosRequestConfig = {
      baseUrl: 'https://www.github.com',
      url: '/user/12345',
      params: {
        idClient: 1,
        idTest: 2,
        testString: 'thisIsATest'
      }
    }
    expect(txios.getUri(fakeConfig)).toBe(
      'https://www.github.com/user/12345?idClient=1&idTest=2&testString=thisIsATest'
    )
  })
})
