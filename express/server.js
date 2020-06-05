'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
const MobileDetect = require('mobile-detect');

router.get('/dev', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!!!</h1>');
  res.end();
});

router.get('/', function (req, res) {

  md = new MobileDetect(req.headers['user-agent']);
  let browserType = "desktop";

  if (md.mobile()) {
    if (md.tablet()) browserType = "tablet";
    else browserType = "phone";
  }
  else if (md.match('playstation|xbox|nintendo')) browserType = "game console";
  else if (md.match('tv')) browserType = "smart tv";

  const params = {
    browser: browserType,
    params: req.query,
    remoteAddress: req.socket.remoteAddress,
    host: req.headers,
  }
  // res.send('<img src="' + canvas.toDataURL() + '" />');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(JSON.stringify(params));
  res.end();
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
