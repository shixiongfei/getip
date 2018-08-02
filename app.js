/*
 * @Author: shixiongfei
 * @Date: 2018-08-02 20:16:30
 * @Last Modified by: shixiongfei
 * @Last Modified time: 2018-08-02 20:49:59
 */

'use strict';

const restify = require('restify');
const _ = require('lodash');

var server = restify.createServer({
  name: 'GetIP',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.jsonp());

server.pre(restify.plugins.queryParser());
server.pre(restify.pre.sanitizePath());

const get_realip = (req) => {
  if (req.header('X-Forwarded-For')) {
    return _.split(req.header('X-Forwarded-For'), ',')[0];
  }
  return req.header('X-Real-IP') || req.connection.remoteAddress;
};

server.get('/', (req, res, next) => {
  res.sendRaw(get_realip(req));
  return next();
});

server.listen(4100, () => {
  console.log('%s listening %s', server.name, server.url);
});
