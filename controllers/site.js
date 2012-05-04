//var tag_ctrl = require('account.js');

//var config = require('../config').config;
//var EventProxy = require('eventproxy').EventProxy;

var config = require('../config').config;
exports.index = function (req, res, next) {

  console.log('here');
  res.render('index', {});

};

exports.login = function (req, res, next) {
  res.render('reg-login', {});
}