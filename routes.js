/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var site = require('./controllers/site');

exports = module.exports = function (app) {

  // home page
  app.get('/', site.index);

};
