import txios, { TxiosError } from '../../src/index'

// 路由不正确
txios({
  url: '/error/getError',
  method: 'get'
}).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
});

// 随机错误
txios({
  url: '/error/get',
  method: 'get'
}).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
});

// 超时
setTimeout(() => {
  txios({
    url: '/error/get',
    method: 'get'
  }).then(res => {
    console.log(res)
  }).catch(e => {
    console.log(e)
  });
}, 5000);

// 传超时时间
txios({
  url: '/error/timeout',
  method: 'get',
  timeout: 2000
}).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e.message)
});

// 显示 TxiosError 类型的 Error
txios({
  url: '/error/timeout',
  method: 'get',
  timeout: 2000
}).then(res => {
  console.log(res)
}).catch((e: TxiosError) => {
  console.log('Error message = ', e.message)
  console.log('Error code = ', e.code)
});
