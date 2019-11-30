import txios, { Canceler } from '../../src/index'

const CancelToken = txios.CancelToken;
const source = CancelToken.source();

// 该请求没有取消
txios.get('/cancel/get', {
  cancelToken: source.token
}).catch(e => {
  if (txios.isCancel(e)) console.log('Request canceled', e.message);
});

// 该请求通过 source.cancel 方式取消
setTimeout(() => {
  source.cancel('Operation canceled by the user.');

  txios.post('/cancel/post', { a: 1 }, { cancelToken: source.token })
    .catch(e => {
      if (txios.isCancel(e)) console.log(e.message)
    });
}, 100);


// 该请求通过 cancel() 方式取消
let cancel: Canceler;
txios.get('/cancel/get', {
  cancelToken: new CancelToken(c => { cancel = c })
}).catch(e => {
  if (txios.isCancel(e)) console.log('Request canceled');
});
setTimeout(() => { cancel() }, 200);
