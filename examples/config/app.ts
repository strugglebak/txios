import txios from '../../src/index'
import qs from 'qs'

// 配置
// txios.defaults.headers.common['test1'] = 123

// txios({
//   url: '/config/post',
//   method: 'post',
//   headers: {
//     test2: 321
//   },
//   data: qs.stringify({ a: 1 }), // 将 a:1 转成 a=1
// }).then(res => {
//   console.log(res.data)
// });

txios({
  transformRequest: [
    (function(data) {
      return qs.stringify(data)
    }),
  ...(txios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [
    ...(txios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
})
