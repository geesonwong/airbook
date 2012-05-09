//var tag_ctrl = require('account.js');

//var config = require('../config').config;
//var EventProxy = require('eventproxy').EventProxy;

var config = require('../config').config;
exports.index = function(req, res, next) {

  res.render('index', {});

};

exports.login = function(req, res, next) {
  if (req.session.account){
    return res.render('index');
  }
  res.render('reg-login', {login : true});
};

exports.register = function(req, res, next) {
  res.render('reg-login', {login : false});
}