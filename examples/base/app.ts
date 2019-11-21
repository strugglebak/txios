import txios from '../../src/index'

// 普通情况
txios({
  url: '/base/get',
  method: 'get',
  params: {
    foo: 1,
    bar: 2
  }
});

// 参数为数组
txios({
  url: '/base/get',
  method: 'get',
  params: {
    foo: ['bar', 'baz']
  }
});

// 参数为对象
txios({
  url: '/base/get',
  method: 'get',
  params: {
    foo: { bar: 'baz' }
  }
});

// 参数为 Date 类型
txios({
  url: '/base/get',
  method: 'get',
  params: {
    foo: new Date()
  }
});

// 参数为特殊字符
txios({
  url: '/base/get',
  method: 'get',
  params: {
    foo: '@:$, '
  }
});

// 参数为 null
txios({
  url: '/base/get',
  method: 'get',
  params: {
    foo: 'null',
    baz: null
  }
});

// url 中有 hash
txios({
  url: '/base/get#hash',
  method: 'get',
  params: {
    foo: 'has hash'
  }
});

// url 中已经有参数
txios({
  url: '/base/get?foo=bar',
  method: 'get',
  params: {
    bar: 'has param bar'
  }
});
