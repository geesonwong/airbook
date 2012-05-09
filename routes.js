/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var site = require('./controllers/site');
var account = require('./controllers/account');

exports = module.exports = function(app) {

  // home page
  app.get('/', site.index);

  app.get('/login', site.login);
  app.get('/register', site.register);

  app.post('/register', account.register);
  app.post('/login', account.login);

};
