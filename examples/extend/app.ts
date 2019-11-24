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

// 响应数据支持泛型
interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

function getUser<T>() {
  return txios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(e => console.error(e));
}

interface User {
  name: string
  age: number
}

async function test() {
  const user = await getUser<User>();
  if (user) {
    console.log(user.result.name)
  }
}
// 解释下，这里相当于用泛型做了 T 的透传
// getUser<User>
// --> txios< ResponseData<User> >
// --> 返回值 TxiosPromise< ResponseData<User> >
// --> Promise< TxiosResponse< ResponseData<User> > >
// --> data 类型 = ResponseData<User>
// 也就是
// { code: number, result: User, message: string }
test();
