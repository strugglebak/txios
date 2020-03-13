const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const router = express.Router();

const cors = {
  'Access-Control-Allow-Origin': 'http://localhost:8888',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// 预检请求
router.options('/more/server2', (req, res) => {
  res.set(cors);
  res.end();
});

router.post('/more/server2', (req, res) => {
  res.set(cors);
  res.json(req.cookies);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

const port = 8088;
module.exports = app.listen(port);
