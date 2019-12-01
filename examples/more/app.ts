import txios from '../../src/index'

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

const instance = txios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
});

instance.get('/more/get')
  .then(res => {
    console.log(res);
  });
