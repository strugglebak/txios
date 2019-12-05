import txios from '../src/index'

// 为 txios 对象的静态方法写测试用例
// all spread
describe('promise', () => {
  test('should support all', done => {
    let fulfilled = false

    // tslint:disable-next-line: no-floating-promises
    txios.all([true, false]).then(arg => {
      fulfilled = arg[0]
    })

    setTimeout(() => {
      expect(fulfilled).toBeTruthy()
      done()
    }, 100)
  })

  test('should support spread', done => {
    let sum = 0
    let fulfilled = false
    let result: any

    // tslint:disable-next-line: no-floating-promises
    txios
      .all([123, 456])
      .then(
        txios.spread((a, b) => {
          sum = a + b
          fulfilled = true
          return 'hello world'
        })
      )
      .then(res => {
        result = res
      })

    setTimeout(() => {
      expect(fulfilled).toBeTruthy()
      expect(sum).toBe(123 + 456)
      expect(result).toBe('hello world')

      done()
    }, 100)
  })
})
