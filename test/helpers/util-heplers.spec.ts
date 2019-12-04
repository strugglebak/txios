import {
  isDate,
  isNormalObject,
  isFormData,
  isUrlSearchParams,
  extend,
  deepMerge
} from '../../src/helpers/util-helper'

describe('helpers: util-helper', () => {
  describe('isXXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })
    test('should validate normalObject', () => {
      expect(isNormalObject({})).toBeTruthy()
      expect(isNormalObject(new Date())).toBeFalsy()
    })
    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })
    test('should validate URLSearchParams', () => {
      expect(isUrlSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isUrlSearchParams('name=struggle&age=18')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }
      extend(a, b)
      expect(a.foo).toBe(123)
    })
    test('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be imutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }

      deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })
    test('should deepMerge properties', () => {
      const a = { foo: 123 }
      const b: any = { bar: 456 }
      const c: any = { foo: 789 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })
    test('should deepMerge recursively', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)
      const d = {
        foo: { bar: 123, baz: 456 },
        bar: { qux: 789 }
      }

      expect(c).toEqual(d)
    })
    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)

      expect(c).toEqual({ foo: { bar: 123 } })
      expect(c.foo).not.toBe(a.foo)
    })
    test('should process null/undefind arguments', () => {
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })

      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })
    })
  })
})
