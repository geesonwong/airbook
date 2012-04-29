var models = require('../models');
var account = models.Account;
var item = models.Item;


var check = require('validator').check;
var sanitize = require('validator').sanitize;

exports.add = function (req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.is_admin) {
    res.send('fobidden!');
    return;
  }
}