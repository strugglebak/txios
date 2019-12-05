import txios from '../src/index'
import mergeConfig from '../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = txios.defaults

  test('should accept undefined for second argument', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  test('should accept an object for second argument', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })

  test('should not leave reference', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })

  test('should allow setting request options', () => {
    const config = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }

    const merged = mergeConfig(defaults, config)
    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
  })

  test('should not inherit request options', () => {
    const config = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = mergeConfig(config, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })

  test('should return default headers if pass config2 with undefined', () => {
    expect(mergeConfig({ headers: 'x-mock-header' }, undefined)).toEqual({
      headers: 'x-mock-header'
    })
  })

  test('should merge auth, headers with defaults', () => {
    expect(
      mergeConfig(
        {
          auth: undefined
        },
        {
          auth: { username: 'foo', password: 'bar' }
        }
      )
    ).toEqual({ auth: { username: 'foo', password: 'bar' } })

    expect(
      mergeConfig(
        {
          auth: { username: 'foo', password: 'bar' }
        },
        {
          auth: { username: 'xxx', password: 'yyy' }
        }
      )
    ).toEqual({
      auth: { username: 'xxx', password: 'yyy' }
    })
  })

  test('should overwrite auth, headers with a non-object value', () => {
    expect(
      mergeConfig(
        {
          headers: {
            common: { Accept: 'application/json, text/plain, */*' }
          }
        },
        {
          headers: null
        }
      )
    ).toEqual({ headers: null })
  })

  test('should allow setting other options', () => {
    const merged = mergeConfig(defaults, { timeout: 123 })
    expect(merged.timeout).toBe(123)
  })
})
