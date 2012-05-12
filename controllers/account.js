var models = require('../models');
var Account = models.Account;
var item = models.Item;

var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var crypto = require('crypto');

var config = require('../config').config;

exports.register = function(req, res, next) {

  var email = sanitize(req.body.email).trim();
  email = sanitize(email).xss();
  var name = sanitize(req.body.name).trim();
  name = sanitize(name).xss();
  var password = sanitize(req.body.password).trim();
  password = sanitize(password).xss();
  var rePassword = sanitize(req.body.rePassword).trim();
  rePassword = sanitize(rePassword).xss();

  if (name == '' || password == '' || rePassword == '' || email == '') {
    return _errorReturn(res, false, '信息不完整', name, email);
  }
  if (name.length < 5) {
    return _errorReturn(res, false, '用户名至少需要5个字符', name, email);
  }
  try {
    check(name, '用户名只能使用0-9，a-z，A-Z。').isAlphanumeric();
  } catch (e) {
    return _errorReturn(res, false, e.message, name, email);
  }
  if (password != rePassword) {
    return _errorReturn(res, false, '两次密码输入不一致', name, email);
  }
  try {
    check(email, '不正确的电子邮箱。').isEmail();
  } catch (e) {
    return _errorReturn(res, false, '不正确的电子邮箱', name, email);
  }

  Account.find({'$or' : [
    {name : name},
    {email : email}
  ]}, function(err, accounts) {
    if (err) return next(err);
    if (accounts.length > 0) {
      return  _errorReturn(res, false, '用户名或邮箱已被使用', name, email);
    }
    // 对密码进行加密
    password = _md5(password);
    // 获取邮箱对应的Gvatar头像地址
    var gvatar_url = 'http://www.gravatar.com/avatar/' + _md5(email) + '?size=48';

    var account = new Account();
    account.name = name;
    account.password = password;
    account.base_email = email;
    account.photo_path = gvatar_url;

    account.save(function(error) {
      if (error) return next(error);
      res.render('reg-login', {login : true, errMsg : '注册成功，请登录'});
    })

  });

};

exports.login = function(req, res, next) {

  var name = sanitize(req.body.name).trim().toLowerCase();
  var password = sanitize(req.body.password).trim();

  if (!name || !password) {
    return _errorReturn(res, true, '信息不完整', name);
  }

  Account.findOne({'name' : name}, function(error, account) {

    if (error) return next(error);

    if (!account)
      return  res.render('reg-login', {errMsg : '这个用户不存在。', login : true});

    password = _md5(password);
    if (password !== account.password)
      return  res.render('reg-login', {errMsg : '密码错误。', login : true});

    // store session cookie
    _gen_session(account, res);

    res.local('account_id', 'sssssss');
    res.local('login', true);

//    res.redirect('/');

    res.render('index');
  });

};

exports.auth_user = function(req, res, next) {
  console.log(req.url + '__');
  if (req.session.account) {
    res.local('account', req.session.account);
    // 如果已经登录的情况
    return next();
  } else {
    var cookie = req.cookies[config.auth_cookie_name];
    if (!cookie) return next();

    var auth_token = _decrypt(cookie, config.session_secret);
    var auth = auth_token.split('\t');
    var account_id = auth[0];
    Account.findOne({_id : account_id}, function(error, account) {
      if (error) {
        return next(error);
      }
      if (account) {
        req.session.account = account;
        res.local('account_id', account_id);
      }
      return next();
    });
  }
};

var _errorReturn = function(res, isLogin, errMsg, name, email) {
  console.log(errMsg);
  res.render('reg-login', {login : isLogin, errMsg : errMsg, email : email, name : name});
};

var _md5 = function(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

var _gen_session = function(account, res) {
  var auth_token = _encrypt(account._id + '\t' + account.name + '\t' + account.password + '\t' + account.base_email, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path : '/', maxAge : 1000 * 60 * 60 * 24 * 7}); //cookie 有效期1周
}
var _encrypt = function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}
var _decrypt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}