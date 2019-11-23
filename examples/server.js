const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');

const app = express();
const complier = webpack(webpackConfig);

const router = express.Router();
router.get('/simple/get', (req, res) => {
  res.json({
    msg: `hello world`
  });
});

router.get('/base/get', (req, res) => {
  res.json(req.query);
});
router.post('/base/post', (req, res) => {
  console.log('req.body = ', req.body)
  res.json(req.body);
});
router.post('/base/buffer', (req, res) => {
  const msg = [];
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk);
    }
  });
  req.on('end', () => {
    const buffer = Buffer.concat(msg);
    res.json(buffer.toJSON());
  });
});


app.use(webpackDevMiddleware(complier, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}));

app.use(webpackHotMiddleware(complier));
app.use(express.static(__dirname)); // 引入静态资源文件供浏览器访问

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

const port = process.env.PORT || 8888;
module.exports = app.listen(port, () => {
  console.log(`请空中转体 420° 打开这个链接 http://127.0.0.1:${port}, 或按 Ctrl + C 停止操作`);
});
