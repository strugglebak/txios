import txios from '../../src/index'

// 添加拦截器


txios.interceptors.request.use(config => {
  config.headers.test += 'request interceptor 1';
  return config;
});

txios.interceptors.request.use(config => {
  config.headers.test += 'request interceptor 2';
  return config;
});
txios.interceptors.request.use(config => {
  config.headers.test += 'request interceptor 3';
  return config;
});

txios.interceptors.response.use(res => {
  res.data += 'response interceptor 1';
  return res
});

const interceptorId =  txios.interceptors.response.use(res => {
  res.data += 'response interceptor 2';
  return res
});
txios.interceptors.response.use(res => {
  res.data += 'response interceptor 3';
  return res
});


// 删除拦截器
txios.interceptors.response.eject(interceptorId)

txios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: ''
  }
}).then(res => {
  console.log(res.data)
});
