import txios from '../../src/index'

txios({
  url: '/simple/get',
  method: 'get',
  params: {
    foo: 1,
    bar: 2
  }
});
