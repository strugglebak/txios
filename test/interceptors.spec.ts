import txios, { TxiosRequestConfig, TxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('interceptors', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a request interceptor', () => {
    const instance = txios.create()
    instance.interceptors.request.use((config: TxiosRequestConfig) => {
      config.headers.test = 'added by interceptor'
      return config
    })
    instance('foo')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders.test).toBe('added by interceptor')
    })
  })

  test('should add a request interceptor that returns a new config object', () => {
    const instance = txios.create()
    instance.interceptors.request.use(() => {
      return { url: '/bar', method: 'post' }
    })
    instance('/foo')

    return getAjaxRequest().then(req => {
      expect(req.url).toBe('/bar')
      expect(req.method).toBe('POST')
    })
  })

  test('should add a request interceptor that returns a promise', done => {
    const instance = txios.create()
    instance.interceptors.request.use((config: TxiosRequestConfig) => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10)
      })
    })
    instance('/foo')

    setTimeout(() => {
      return getAjaxRequest().then(req => {
        expect(req.requestHeaders.async).toBe('promise')

        done()
      })
    }, 100)
  })

  test('should add multiple request interceptors', () => {
    const instance = txios.create()

    instance.interceptors.request.use(config => {
      config.headers.test1 = '1'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test2 = '2'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test3 = '3'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders.test1).toBe('1')
      expect(req.requestHeaders.test2).toBe('2')
      expect(req.requestHeaders.test3).toBe('3')
    })
  })

  test('should add a response interceptor', done => {
    let response: TxiosResponse
    const instance = txios.create()

    instance.interceptors.response.use(res => {
      res.data = res.data + '- modified by interceptor'
      return res
    })

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: 'OK' })

      setTimeout(() => {
        expect(response.data).toBe('OK- modified by interceptor')

        done()
      }, 100)
    })
  })

  test('should add a response interceptor that returns a new data object', done => {
    let response: TxiosResponse
    const instance = txios.create()

    instance.interceptors.response.use(() => {
      return {
        data: 'stuff',
        headers: null,
        status: 500,
        statusText: 'ERR',
        request: null,
        config: {}
      }
    })

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: 'OK' })

      setTimeout(() => {
        expect(response.data).toBe('stuff')
        expect(response.headers).toBeNull()
        expect(response.status).toBe(500)
        expect(response.statusText).toBe('ERR')
        expect(response.request).toBeNull()
        expect(response.config).toEqual({})

        done()
      }, 100)
    })
  })

  test('should add a response interceptor that returns a promise', done => {
    let response: TxiosResponse
    const instance = txios.create()

    instance.interceptors.response.use(res => {
      return new Promise(resolve => {
        setTimeout(() => {
          res.data = 'you have been promised!'
          resolve(res)
        }, 10)
      })
    })

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: 'OK' })

      setTimeout(() => {
        expect(response.data).toBe('you have been promised!')
        done()
      }, 100)
    })
  })

  test('should add multiple response interceptors', done => {
    let response: TxiosResponse
    const instance = txios.create()

    instance.interceptors.response.use(res => {
      res.data = res.data + '1'
      return res
    })
    instance.interceptors.response.use(res => {
      res.data = res.data + '2'
      return res
    })
    instance.interceptors.response.use(res => {
      res.data = res.data + '3'
      return res
    })

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: 'OK' })

      setTimeout(() => {
        expect(response.data).toBe('OK123')
        done()
      }, 100)
    })
  })

  test('should allow removing interceptors', done => {
    let response: TxiosResponse
    const instance = txios.create()

    instance.interceptors.response.use(res => {
      res.data = res.data + '1'
      return res
    })
    let intercept = instance.interceptors.response.use(res => {
      res.data = res.data + '2'
      return res
    })
    instance.interceptors.response.use(res => {
      res.data = res.data + '3'
      return res
    })

    instance.interceptors.response.eject(intercept)
    instance.interceptors.response.eject(5)

    // tslint:disable-next-line: no-floating-promises
    instance('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: 'OK' })

      setTimeout(() => {
        expect(response.data).toBe('OK13')
        done()
      }, 100)
    })
  })
})
