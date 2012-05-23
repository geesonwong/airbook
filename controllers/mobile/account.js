var models = require('../../models');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var item = models.Item;
var Account = models.Account;

var sessionUtil = require('../../utils/sessionUtil');

exports.login = function(req, res, next) {

  console.log('...');

  var name = sanitize(req.body.name).trim().toLowerCase();
  var password = sanitize(req.body.password).trim();

  if (!name || !password) {
    return res.json({success : false, message : '信息不完整'});
  }

  Account.findOne({'name' : name}, function(error, account) {

    if (error)
      return res.json({success : false, message : '不存在该用户'});

    if (!account)
      return res.json({success : false, message : '不存在该用户'});

    password = sessionUtil.md5(password);
    if (password !== account.password)
      return res.json({success : false, message : '密码错误'});

    // store session cookie
    sessionUtil.gen_session(account, res);
    return res.json({success : true, message : '登录成功'});

  });

};