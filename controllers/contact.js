var models = require('../models');
var Account = models.Account;
var Contact = models.Contact;
var item = models.Item;

var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var crypto = require('crypto');

var config = require('../config').config;

exports.randomResults = function(req, res, next) {
  Account.find({}, function(err, accounts) {//TODO 随机推荐
    if (err) return res.json({success : false, message : '系统错误'});
    res.json({success : true, results : JSON.stringify(accounts)});
  });
};