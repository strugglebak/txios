import txios from '../src/index'
import { getAjaxRequest } from './helper'
import { doesNotReject } from 'assert'

describe('cancel', () => {
  const CancelToken = txios.CancelToken
  const Cancel = txios.Cancel
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  describe('when called before sending request', () => {
    test('should rejects Promise with a Cancel object', () => {
      const source = CancelToken.source()
      source.cancel('Operation has been canceled.')

      return txios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(reason => {
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe('Operation has been canceled.')
        })
    })
  })

  describe('when called after request has been sent', () => {
    test('should rejects Promise with a Cancel object', done => {
      const source = CancelToken.source()

      txios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(reason => {
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe('Operation has been canceled.')

          done()
        })

      return getAjaxRequest().then(req => {
        source.cancel('Operation has been canceled.')
        setTimeout(() => {
          req.respondWith({ status: 200, responseText: 'OK' })
        }, 100)
      })
    })

    test('should calls abort on request object', done => {
      const source = CancelToken.source()
      let request: any
      txios.get('/foo', { cancelToken: source.token }).catch(() => {
        expect(request.statusText).toBe('abort')
        done()
      })

      return getAjaxRequest().then(req => {
        source.cancel()
        request = req
      })
    })
  })

  describe('when called after response has been received', () => {
    test('should not cause unhandled rejection', done => {
      const source = CancelToken.source()
      // tslint:disable-next-line: no-floating-promises
      txios.get('/foo', { cancelToken: source.token }).then(() => {
        window.addEventListener('unhandledrejection', () => {
          done.fail('Unhandled rejection.')
        })
        source.cancel()
        setTimeout(done, 100)
      })

      return getAjaxRequest().then(req => {
        req.respondWith({ status: 200, responseText: 'OK' })
      })
    })
  })
})
