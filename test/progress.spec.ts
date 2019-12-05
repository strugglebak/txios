import txios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handler', () => {
    const progressSpy = jest.fn()

    txios('/foo', { onDownloadProgress: progressSpy })

    return getAjaxRequest().then(req => {
      req.respondWith({ status: 200, responseText: '{"foo": "bar"}' })
      expect(progressSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()

    txios('/foo', { onUploadProgress: progressSpy })

    return getAjaxRequest().then(req => {
      // Jasmine AJAX doesn't trigger upload events.Waiting for jest-ajax fix
      // expect(progressSpy).toHaveBeenCalled()
    })
  })
})
