## txios

![npm](https://img.shields.io/npm/v/txios?style=flat-square)
![Travis (.org)](https://img.shields.io/travis/strugglebak/txios?style=flat-square)
![Coveralls github](https://img.shields.io/coveralls/github/strugglebak/txios?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/txios?style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/txios/badge)](https://www.jsdelivr.com/package/npm/txios)

一个基于 Promise 的 HTTP 库，使用 TypeScript 封装，可在常规浏览器上使用

> [📢相关博客链接点击这里](https://strugglebak.github.io/2020/03/14/txios-%E5%9F%BA%E4%BA%8ETypeScript%E7%9A%84http%E5%BA%93%E7%9A%84%E5%AE%9E%E8%B7%B5%E6%80%BB%E7%BB%93/)

> 注意: `txios` 是基于 **`Rollup`** 进行编译打包，但是在项目构建阶段依然采用了 **`Webpack 4.x`**，其中的调试命令请参考 `package.json` 中的 `script` 选项

> 项目在线 demo 为 --> [在 Vue 中引入 txios](https://jsbin.com/pijokizexe/edit?html,js,output)

> :warning: 目前项目暂不支持 Node.js，未来将会继续推出 txios 的 Node 版本

## 功能支持

 - 支持使用 XMLHttpRequest 对象通信
 - 支持 Promise API
 - 支持请求/响应拦截以及其过程中的数据转换
 - 支持取消请求
 - 支持自动转换 JSON 数据
 - 客户端支持 XSRF 防御

## 浏览器支持

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ |

## 安装

使用 npm

```bash
npm install txios
```

使用 yarn

```bash
yarn add txios
```

使用 cdn

```html
<script src="https://cdn.jsdelivr.net/npm/txios@0.1.0/dist/txios.umd.min.js"></script>
```

## 例子

### 注意：ES6 模块引入

为了得到 TypeScript 的类型，你可以做如下的写法

```js
import txios from 'txios'

// 你就可以通过 txios.<method> 的方式访问到它里面的方法了
```

发送一个 `GET` 请求

```js
import txios from 'txios'

// 通过给定 id 发送 foo 的请求
txios.get('/foo?name=strugglebak')
  .then(response => {
    // 处理请求成功相关操作
  })
  .catch(error => {
    // 处理请求失败相关操作
  })
  .finally(() => {
    // 无论如何总是会执行的操作
  })

// 上面的请求也支持如下的写法
txios.get('/foo', {
  params: {
    name: 'strugglebak'
  }
})
  .then(response => {
    // 处理请求成功相关操作
  })
  .catch(error => {
    // 处理请求失败相关操作
  })
  .finally(() => {
    // 无论如何总是会执行的操作
  })
```

如果你也想使用 async/await 语法

```js
async function findFoo() {
  try {
    const response = await txios.get('/foo?name=strugglebak')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}
```

> 注意: async/await 语法属于 ES7 的，所以这里并不支持一些 **老旧的浏览器** 以及 **老大难 IE**

发送一个 `POST` 请求

```js
txios.post('/foo', {
  name: 'strugglebak',
  age: 18
})
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })
```

并行发送多个请求

```js
function getFoo1() {
  return txios.get('/foo/strugglebak/1')
}
function getFoo2() {
  return txios.get('/foo/strugglebak/2')
}

txios.all([getFoo1(), getFoo2()])
  .then(txios.spread((response1, response2) => {
    console.log('getFoo1', response1)
    console.log('getFoo2', response2)
  }))

// 也支持这么写
txios.all([getFoo1(), getFoo2()])
  .then(([response1, response2]) => {
    console.log('getFoo1', response1)
    console.log('getFoo2', response2)
  })
```

## txios 相关 API

通过传配置的方式发送请求

### txios(config)

```js
// 发送 POST 请求
txios({
  method: 'post',
  url: '/foo/strugglebak',
  data: {
    name: 'strugglebak',
    age: 18
  }
});
```

### txios(url[, config])

```js
// 发送 GET 请求(默认不传参就是 GET 请求)
txios('/foo/strugglebak')
```

## 请求方法 API

所有请求方法都有对应的 HTTP 请求名

```js
txios.get(url[, config])
txios.delete(url[, config])
txios.head(url[, config])
txios.options(url[, config])
txios.post(url[, data[, config]])
txios.put(url[, data[, config]])
txios.patch(url[, data[, config]])
```

当然还有

```js
txios.request(url[, config])
```

### 注意

在使用这种 HTTP 别名的方式来发送请求时(不包括 `request`)，`config` 属性不需要加 `url`、`method`、`data` 属性

在使用 `request` 时，不需要加 `url` 属性

## 并发请求

有两个 API 可以帮助你实现并发请求

```js
txios.all(iterable)
txios.spread(callback)
```

## 创建实例

你可以使用 **自定义配置** 去创建一个 txios 实例

### txios.create([config])

```js
const instance = txios.create({
  baseUrl: 'https://github.com',
  timeout: 500,
  headers: {
    'X-COMMON-HEADER': 'foo'
  }
})
```

## 实例方法

同样的，instance 实例都具有 txios 里面的方法, 同时传参数的方式都是一样的

```js
txios#request(config)
txios#get(url[, config])
txios#delete(url[, config])
txios#head(url[, config])
txios#options(url[, config])
txios#post(url[, data[, config]])
txios#put(url[, data[, config]])
txios#patch(url[, data[, config]])
txios#getUri([config])
```

## 请求配置

在如下的请求配置项中，只有 `url` 属性是 **必填** 的，其他的配置项都是可选的

```js
{
  // `url` 就是请求地址
  url: '/foo',
  // `method` 就是请求方法, 支持 HTTP 7 种请求方式
  method: 'get', // 默认配置
  // `params` 就是需要拼接到 url 的 query string 中的数据，支持 **任意类型数据**
  params: 'strugglebak',
  // `data` 就是请求数据，一般是放在请求体内的，支持 **任意类型数据**
  data: 'strugglebak',
  // `responseType` 就是响应数据类型，可以是 ""|arrayBuffer|blob|document|json|text
  responseType: 'arraybuffer',
  // `timeout` 就是超时时间，若请求在超出该时间内无响应则抛异常
  timeout: 1000,
  // `transformRequest` 就是请求配置属性
  // 这个属性可以是一个函数, 也可以是由函数组成的数组
  // 目的就是在请求数据发送到服务器之前对其进行修改
  transformRequest: [(data) => {
    // 在这里对数据进行修改的操作
    return data
  }],
  // `transformResponse` 就是响应配置属性
  // 这个属性可以是一个函数, 也可以是由函数组成的数组
  // 目的就是在响应数据传递给 then 或者 catch 之前对它们进行修改
  transformResponse: [(data) => {
    // 在这里对数据进行修改的操作
    return data
  }],
  // `cancelToken` 就是指定一个取消的 token 然后去取消请求
  // 详情见下面的 CancelToken 章节
  cancelToken: new CancelToken(c => {}),
  // `withCredentials` 就是 CORS 跨域时客户端需要在 headers 种设置的一个字段
  // 携带 cookie 时需要做设置
  withCredentials: true,
  // `xsrfCookieName` 就是 xsrf 防御时需要存储 token 的 cookie 名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认配置
  // `xsrfHeaderName` 就是 xsrf 防御时请求 Headers 中 token 对应的 header 名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认配置
  // `onDownloadProgress` 就是下载进度监控
  onDownloadProgress: (progressEvent) => {
    // 监听下载进度
  },
  // `onUploadProgress` 就是上传进度监控
  onUploadProgress: (progressEvent) => {
    // 监听上传进度
  },
  // `auth` 就是服务端用于验证用户代理时使用
  auth: {
    username: 'strugglebak',
    password: '123456'
  },
  // `validateStatus` 就是自定义合法的状态码校验规则
  validateStatus: (status) => {
     return status >= 200 && status < 400
  },
  // `paramsSerializer` 就是自定义 params 的解析规则
  // 然后返回 params 的解析结果
  // 这个 params 就是上述配置项中的 params
  paramsSerializer: (params) => {
    // 这里做参数的序列化操作
    return params
  },
  // `baseUrl` 就是公共的域名
  baseUrl: 'https://github.com'
}
```

## 响应数据的格式

```js
{
  // `data` 就是服务端返回的数据
  data: {},
  // `status` 就是服务端返回的 HTTP 状态码
  status: 200,
  // `statusText` 就是服务端返回的状态信息
  statusText: 'OK',
  // `headers` 就是服务端返回的响应头信息
  headers: {},
  // `config` 就是 txios 中你配置的请求信息
  config: {},
  // `request` 就是一个在浏览器端的 XMLHttpRequest 实例
  request: {}
}
```

当使用 `then` 时，你会得到

```js
txios.get('/foo/strugglebak')
  .then(response => {
    console.log(response.data)
    console.log(response.status)
    console.log(response.statusText)
    console.log(response.headers)
    console.log(response.config)
  })
```

当然，若你使用 `catch` 或者在 `then` 中传 `reject` 回调, `response` 将会在 `error` 中访问到，相关章节请访问 [错误处理](#错误处理)

## 默认配置

你可以给每个请求搞个默认的配置

### 全局默认配置

```js
txios.defaults.headers.common['xxx'] = XXX
txios.defaults.headers.post['Content-Type'] = 'application/json'
txios.defaults.baseUrl = 'https://github.com'
```

### 自定义实例配置

```js
// 创建实例的时候就可以设置默认配置了
const instance = axios.create({
  baseUrl: 'https://github.com'
});

// 创建实例后也可以对全局默认配置做修改
instance.defaults.headers.common['XXX'] = XXX
```

### 配置的优先级

后面配置的将会比前面配置的优先级高，因为默认配置项在合并时，会遵从 `defalut.ts` -> `instance` 里的配置 -> `config` 参数里面的配置这样的顺序，以下是一个例子

```js
// 从默认配置里面找, timeout = 0
const instance = txios.create()
// 设置全局默认配置，此时 timeout = 1000
instance.defaults.timeout = 1000
// 覆盖了全局默认配置，此时 timeout = 10
instance.get('/foo', {
  timeout: 10
})
```

## 拦截器

在 `then` 或者 `catch` 之前对请求或者响应进行拦截

```js
// 添加请求拦截器
txios.interceptors.request.use(
  config => {
    // 在请求发送之前做处理
    return config
  },
  error => {
    // 处理 error
    return Promise.reject(error)
  })

// 添加响应拦截器
txios.interceptors.response.use(
  res => {
    // 在 `then`、 `catch` 之前做处理
    return res
  },
  error => {
    // 处理 error
    return Promise.reject(error)
  })
```

同时你也可以删除一个拦截器

```js
const interceptorId =  txios.interceptors.response.use(res => {
  // 在 `then`、 `catch` 之前做处理
  return res
})
txios.interceptors.response.eject(interceptorId)
```

也可以同时添加多个拦截器

```js
// 添加多个请求拦截器
txios.interceptors.request.use(config => {
  config.headers.test += 'request interceptor 1'
  return config
});
txios.interceptors.request.use(config => {
  config.headers.test += 'request interceptor 2'
  return config
})
txios.interceptors.request.use(config => {
  config.headers.test += 'request interceptor 3'
  return config
})

// 添加多个响应拦截器
txios.interceptors.response.use(res => {
  res.data += 'response interceptor 1'
  return res
})
txios.interceptors.response.use(res => {
  res.data += 'response interceptor 2'
  return res
})
txios.interceptors.response.use(res => {
  res.data += 'response interceptor 3'
  return res
})
```

## 错误处理

```js
txios.get('/foo/strugglebak')
  .catch(error => {
    console.log(error.config);
    console.log(error.code);
    console.log(error.request);
    console.log(error.isTxiosError)
    console.log(error.response)
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  })
```

可以使用 `validateStatus` 配置项来决定接受到哪些 HTTP 状态码才抛出异常

```js
txios('/foo/strugglebak', {
  validateStatus: (status) => {
    return < 200 // 只要比 200 大的状态码都抛异常
  }
})
```

## 取消请求

你可以通过一个 `cancel token` 来取消请求

通过使用 `CancelToken.source` 这个工厂函数，你可以创建一个 `cancel token`

```js
const CancelToken = txios.CancelToken
const source = CancelToken.source()

// 该请求没有取消
txios.get('/cancel/get', {
  cancelToken: source.token
}).catch(e => {
  if (txios.isCancel(e)) console.log('Request canceled', e.message)
})

// 该请求通过 source.cancel 方式取消
setTimeout(() => {
  source.cancel('Operation canceled by the user.')

  txios.post('/cancel/post', { a: 1 }, { cancelToken: source.token })
    .catch(e => {
      if (txios.isCancel(e)) console.log(e.message)
    })
}, 100)
```

其中 `isCancel` 是判断这个错误参数 `e` 是不是一次取消请求导致的错误

你还可以通过在 `CancelToken` 构造函数中传一个执行函数的形式来创建一个 `cancel token`

```js
// 该请求通过 cancel() 方式取消
let cancel: Canceler
txios.get('/cancel/get', {
  cancelToken: new CancelToken(c => { cancel = c })
}).catch(e => {
  if (txios.isCancel(e)) console.log('Request canceled')
})
setTimeout(() => { cancel() }, 200)
```

## 建议
### 使用 application/x-www-form-urlencoded 格式

默认情况下，txios 会将 JS 对象转换成 `JSON`, 所以如果你想要以 `application/x-www-form-urlencoded` 的形式发送数据，最好这样做

#### 浏览器端

你可以使用 `URLSearchParams` 这个 API

```js
const params = new URLSearchParams()
params.append('param1', 'value1')
params.append('param2', 'value2')
txios.post('/foo', params)
```

> 注意 `URLSearchParams` 这个 API 并不是被所有浏览器支持的，请酌情使用哈~，相关兼容性请去看 [caniuse](https://caniuse.com/#search=URLSearchParams)

或者你可以使用 `qs` 这个库

```js
import qs from 'qs'
txios.post('/foo', qs.stringify({ name: 'strugglebak' }))
```

## Promises

txios 依赖于原生 ES6 Promise 实现, 如果贵环境还不[支持](https://caniuse.com/#search=promises) ES6 语法，你可以试试 [es6-promise](https://github.com/stefanpenner/es6-promise)

## License
[MIT](./LICENSE)
