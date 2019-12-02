import txios from '../../src/index'
import NProgress from 'nprogress'
import { TxiosError } from '../../src/helpers/error-helper';
import qs from 'qs'

// document.cookie = 'a=b';

// txios.get('/more/get')
//   .then(res => {
//     console.log('/more/get', res)
//   });


// txios.post('http://127.0.0.1:8088/more/server2', {}, {
//   withCredentials: true
// }).then(res => {
//   console.log('/more/post', res)
// });

// const instance = txios.create({
//   xsrfCookieName: 'XSRF-TOKEN-D',
//   xsrfHeaderName: 'X-XSRF-TOKEN-D'
// });

// instance.get('/more/get')
//   .then(res => {
//     console.log(res);
//   });

// const instance = txios.create();
// loadProgressBar();

// const downloadElement = document.getElementById('download');
// downloadElement!.addEventListener( 'click', e => {
//   instance.get('https://avatars3.githubusercontent.com/u/17985856?s=460&v=4')
//     .then(res => {
//       console.log(res)
//     })
//     .catch(e => {
//       console.log(e)
//     });
// });

// const uploadElement = document.getElementById('upload');
// uploadElement!.addEventListener('click', e => {
//   const data = new FormData();
//   const fileElement = document.getElementById('file') as HTMLInputElement;

//   if (!fileElement.files) return
//   data.append('file', fileElement.files[0]);
//   instance.post('/more/upload', data);
// });

// function calculatePercentage(loaded: number, total: number): any {
//   // 精确到 1 位小数
//   return Math.floor(loaded * 1.0) / total;
// }
// function loadProgressBar(): void {
//   // 设置开始的进度条
//   const setupStartProgress = () => {
//     instance.interceptors.request.use(config => {
//       NProgress.start();
//       return config
//     });
//   }
//   // 设置更新中的进度条
//   const setupUpdateProgress = () => {
//     const update = (e: ProgressEvent) => {
//       console.log(e)
//       NProgress.set(calculatePercentage(e.loaded, e.total));
//     }
//     instance.defaults.onDownloadProgress = update;
//     instance.defaults.onUploadProgress = update;
//   }
//   // 设置停止时的进度条
//   const setupStopProgress = () => {
//     instance.interceptors.response.use(res => {
//       NProgress.done();
//       return res;
//     }, e => {
//       NProgress.done();
//       return Promise.reject(e);
//     });
//   }

//   setupStartProgress();
//   setupUpdateProgress();
//   setupStopProgress();
// }

// txios.post('/more/post', {
//   a: 1
// }, {
//   auth: {
//     username: 'strugglebak',
//     password: '123456'
//   }
// }).then(res => {
//   console.log(res)
// });

// txios.get('/more/304')
//   .then(res => {
//     console.log(res)
//   })
//   .catch((e: TxiosError) => {
//     console.log(e.message)
//   });

// txios.get('/more/304', {
//   validateStatus(status) {
//     return status >= 200 && status < 400
//   }
// })
//   .then(res => {
//     console.log(res)
//   })
//   .catch((e: TxiosError) => {
//     console.log(e.message)
//   });

// txios.get('/more/get', {
//   params: new URLSearchParams('a=b&c=d')
// }).then(res => {
//   console.log(res)
// });

// txios.get('/more/get', {
//   params: {
//     a: 1,
//     b: 1,
//     c: ['a', 'b', 'c']
//   }
// }).then(res => {
//   console.log(res)
// });

// const instance = txios.create({
//   paramsSerializer(params) {
//     // 对 [] 转义
//     return qs.stringify(params, { arrayFormat: 'brackets'});
//   }
// });
// instance.get('/more/get', {
//   params: {
//     a: 1,
//     b: 1,
//     c: ['a', 'b', 'c']
//   }
// }).then(res => {
//   console.log(res)
// });

const instance = txios.create({
  baseUrl: 'https://avatars3.githubusercontent.com'
});
instance.get('/u/17985856?s=460&v=4');
instance.get('https://avatars3.githubusercontent.com/u/17985856?s=460&v=4')
