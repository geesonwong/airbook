/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var path = require('path');
var config = require('./config').config;

var app = module.exports = express.createServer();

// Configuration

app.configure(function () {

  var viewsRoot = path.join(__dirname,'views');

  app.set('views',viewsRoot);
  app.set('view engine', 'html');
  app.register('.html',require('ejs'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret : config.session_secret
  }));
  app.use(express.methodOverride());
  app.use(app.router);
//  app.use(express.static(__dirname + '/public'));
});

var static_dir = path.join(__dirname, 'public');

app.configure('development', function () {
  app.use(express.static(static_dir));
  app.use(express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.configure('production', function () {
  var maxAge = 3600000 * 24 * 30;
  app.use(express.static(static_dir, { maxAge: maxAge }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

// routes
routes(app);

app.listen(config.port, function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});