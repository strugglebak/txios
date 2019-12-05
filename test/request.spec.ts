import txios, { TxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'
import { TxiosError } from '../src/helpers/error-helper'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    txios('/foo')
    return getAjaxRequest().then(req => {
      expect(req.url).toBe('/foo')
      expect(req.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', done => {
    // tslint:disable-next-line: no-floating-promises
    txios({
      url: '/foo',
      method: 'POST'
    }).then(req => {
      expect(req.config.method).toBe('post')

      done()
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200 })
    })
  })

  test('should reject on network errors', done => {
    const resolveSpy = jest.fn((res: TxiosResponse) => res)
    const rejectSpy = jest.fn((e: TxiosError) => e)
    jasmine.Ajax.uninstall()
    // tslint:disable-next-line: no-floating-promises
    txios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then((reason: TxiosResponse | TxiosError) => {
        expect(resolveSpy).not.toHaveBeenCalled()
        expect(rejectSpy).toHaveBeenCalled()
        expect(reason instanceof Error).toBeTruthy()
        expect((reason as TxiosError).message).toBe('Network Error')
        expect(reason.request).toEqual(expect.any(XMLHttpRequest))

        jasmine.Ajax.install()

        done()
      })
  })

  test('should reject when request timeout', done => {
    let err: TxiosError
    txios('/foo', { timeout: 2000, method: 'post' }).catch(e => {
      err = e
    })

    return getAjaxRequest().then(req => {
      // @ts-ignore
      req.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000ms exceeded')

        done()
      }, 100)
    })
  })

  test('should reject when validateStatus returns false', done => {
    const resolveSpy = jest.fn((res: TxiosResponse) => res)
    const rejectSpy = jest.fn((e: TxiosError) => e)
    // tslint:disable-next-line: no-floating-promises
    txios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then((reason: TxiosError | TxiosResponse) => {
        expect(resolveSpy).not.toHaveBeenCalled()
        expect(rejectSpy).toHaveBeenCalled()
        expect(reason instanceof Error).toBeTruthy()
        expect((reason as TxiosError).message).toBe(
          'Request failed with status code 500'
        )
        expect((reason as TxiosError).response!.status).toBe(500)

        done()
      })
    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(req => {
      req.respondWith({ status: 500 })
    })
  })

  test('should resolve when validateStatus returns true', done => {
    const resolveSpy = jest.fn((res: TxiosResponse) => res)
    const rejectSpy = jest.fn((e: TxiosError) => e)
    // tslint:disable-next-line: no-floating-promises
    txios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then((reason: TxiosError | TxiosResponse) => {
        expect(resolveSpy).toHaveBeenCalled()
        expect(rejectSpy).not.toHaveBeenCalled()
        expect(reason.config.url).toBe('/foo')

        done()
      })

    // tslint:disable-next-line: no-floating-promises
    getAjaxRequest().then(req => {
      req.respondWith({ status: 500 })
    })
  })

  test('should return JSON when resolved', done => {
    let response: TxiosResponse

    // tslint:disable-next-line: no-floating-promises
    txios('/api/account/signUp', {
      auth: { username: '', password: '' },
      method: 'post',
      headers: { Accept: 'application/json' }
    }).then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"a":1}'
      })
      setTimeout(() => {
        expect(response.data).toEqual({ a: 1 })

        done()
      }, 100)
    })
  })

  test('should return JSON when rejecting', done => {
    let response: TxiosResponse

    // tslint:disable-next-line: no-floating-promises
    txios('/api/account/signUp', {
      auth: { username: '', password: '' },
      method: 'post',
      headers: { Accept: 'application/json' }
    }).catch(e => {
      response = e.response
    })

    return getAjaxRequest().then(req => {
      req.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error":"BAD USERNAME", "code":1}'
      })
      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.error).toBe('BAD USERNAME')
        expect(response.data.code).toBe(1)

        done()
      }, 100)
    })
  })

  test('should supply correct response', done => {
    let response: TxiosResponse

    // tslint:disable-next-line: no-floating-promises
    txios.post('/foo').then(res => {
      response = res
    })
    return getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo": "bar"}',
        responseHeaders: { 'Content-Type': 'application/json' }
      })

      setTimeout(() => {
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(response.data.foo).toBe('bar')
        expect(response.headers['content-type']).toBe('application/json')

        done()
      }, 100)
    })
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    let response: TxiosResponse

    // tslint:disable-next-line: no-floating-promises
    txios
      .post(
        '/foo',
        { prop: 'value' },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .then(res => {
        response = res
      })

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['Content-Type']).toBe('application/json')
    })
  })
})
