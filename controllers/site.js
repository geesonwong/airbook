//var tag_ctrl = require('account.js');

//var config = require('../config').config;
//var EventProxy = require('eventproxy').EventProxy;

var config = require('../config').config;

exports.login = function(req, res, next) {
  if (req.session.account) {
    res.local('msg', '你已经登录。');
    return next();
  }
  res.render('reg-login', {login : true});
};

exports.register = function(req, res, next) {
  res.render('reg-login', {login : false});
}


exports.index = function(req, res, next) {
  if (!req.session.account) {
    return res.render('reg-login', {login : true});
  }
  var account = req.session.account;
  res.local('account', account);
  return res.render('index');
};

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path : '/' });
  res.json({success : true})
};