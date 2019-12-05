import txios, { TxiosResponse, TxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('transform', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform JSON to string', () => {
    const data = { foo: 'bar' }
    txios.post('/foo', data)

    return getAjaxRequest().then(req => {
      expect(req.params).toBe('{"foo":"bar"}')
    })
  })

  test('should transform string to JSON', done => {
    let response: TxiosResponse

    // tslint:disable-next-line: no-floating-promises
    txios('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: '{"foo": "bar"}' })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.foo).toBe('bar')

        done()
      }, 100)
    })
  })

  test('should override default transform', () => {
    const data = { foo: 'bar' }

    txios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })

    return getAjaxRequest().then(req => {
      expect(req.params).toEqual({ foo: 'bar' })
    })
  })

  test('should allow an Array of transformers', () => {
    const data = { foo: 'bar' }

    txios.post('/foo', data, {
      transformRequest: (txios.defaults
        .transformRequest as TxiosTransformer[]).concat(function(data) {
        return data.replace('bar', 'baz')
      })
    })

    return getAjaxRequest().then(req => {
      expect(req.params).toBe('{"foo":"baz"}')
    })
  })

  test('should allowing mutating headers', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)

    txios('/foo', {
      transformRequest: (data, headers) => {
        headers['X-Authorization'] = token
        return data
      }
    })

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['X-Authorization']).toEqual(token)
    })
  })
})
