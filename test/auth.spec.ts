import txios from '../src/index'
import { getAjaxRequest } from './helper'

describe('auth', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should accept HTTP Basic auth with username/password', () => {
    txios('/foo', {
      auth: {
        username: 'Aladdin',
        password: 'open sesame'
      }
    })

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['Authorization']).toBe(
        'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      )
    })
  })

  test('should fail to encode HTTP Basic auth credentials with non-Latin1 characters', () => {
    return txios('/foo', {
      auth: {
        username: 'Aladßç£☃din',
        password: 'open sesame'
      }
    })
      .then(() => {
        throw new Error(
          'Should not succeed to make a HTTP Basic auth request with non-latin1 chars in credentials.'
        )
      })
      .catch(e => {
        expect(/character/i.test(e.message)).toBeTruthy()
      })
  })
})
