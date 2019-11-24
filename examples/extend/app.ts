import txios from '../../src/index'

// 直接调用 txios() 方法
txios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: '直接调用 txios() 方法'
  }
});

// 调用 txios.request 方法
txios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: '调用 txios.request 方法'
  }
});

// 调用各种 HTTP 方法
txios.get('/extend/get');
txios.delete('/extend/delete');
txios.head('/extend/head');
txios.options('/extend/options');
txios.post('/extend/post', { msg: 'post' });
txios.put('/extend/put', { msg: 'put' });
txios.patch('/extend/patch', { msg: 'patch' });

// 传两个参数发送请求
txios('/extend/post', {
  method: 'post',
  data: {
    msg: '这是传两个参数发送的请求'
  }
});
