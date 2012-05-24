var models = require('../models');
var Account = models.Account;
var item = models.Item;

var EventProxy = require('eventproxy').EventProxy;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var crypto = require('crypto');

var config = require('../config').config;

// 注册
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
    var gvatar_url = 'http://www.gravatar.com/avatar/' + _md5(email);

    var account = new Account();
    account.name = name;
    account.password = password;
    account.base_email = email;
    account.photo_path = gvatar_url;

    account.card = '<img src="' + account.photo_path + '?size=32" alt="">';
    account.card += "<h2>" + account.last_name + ' ' + account.first_name + "</h2>";
    account.card += "<h3>邮箱:" + account.base_email + "</h3>";
    account.card += "<h3>电话：" + account.base_phone + "</h3>";

    account.save(function(error) {
      if (error) return next(error);
      res.local('errMsg', '注册成功，请登录');
      return next();
    })

  });

};

// 登录
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

    res.redirect('/');

  });

};

// 中间件，从cookie中找到会话信息
exports.auth_user = function(req, res, next) {
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

// 修改密码
exports.changePassword = function(req, res, next) {
  var oldPassword = _md5(sanitize(req.body.old_password).trim());
  var newPassword = _md5(sanitize(req.body.new_password).trim());
  var reNewPassword = _md5(sanitize(req.body._new_password).trim());
  try {
    if (oldPassword != req.session.account.password) {
      res.json({success : false, message : '现有密码错误'});
    } else {
      if (newPassword == reNewPassword) {
        Account.findById(req.session.account._id, function(err, account) {
          if (err) return res.json({success : false, message : '发生系统错误'});
          account.password = newPassword;
          account.save(function(err) {
            if (err) return res.json({success : false, message : '发生系统错误'});
            return res.json({success : true, message : '修改密码成功'});
          });
        });
      } else {
        res.json({success : false, message : '新密码不一致'});
      }
    }
  } catch (e) {
    return res.json({success : false, message : e.message});
  }
}

// 修改个人信息
exports.updateAccount = function(req, res, next) {

  var baseEmail = sanitize(req.body.baseEmail).trim();
  baseEmail = sanitize(baseEmail).xss();
  var basePhone = sanitize(req.body.basePhone).trim();
  basePhone = sanitize(basePhone).xss();
  var firstName = sanitize(req.body.firstName).trim();
  firstName = sanitize(firstName).xss();
  var lastName = sanitize(req.body.lastName).trim();
  lastName = sanitize(lastName).xss();
  var qq = sanitize(req.body.qq).trim();
  qq = sanitize(qq).xss();
  var addr = sanitize(req.body.addr).trim();
  addr = sanitize(addr).xss();
  var homepage = sanitize(req.body.homepage).trim();
  homepage = sanitize(homepage).xss();

  try {
    if (baseEmail && baseEmail != '')
      check(baseEmail, '不正确的电子邮箱').isEmail();
  } catch (e) {
    return res.json({success : false, message : e.message});
  }

  try {
    if (basePhone && basePhone != '')
      check(basePhone, '不正确的电话号码').isNumeric();
  } catch (e) {
    return res.json({success : false, message : e.message});
  }

  try {
    if (qq && qq != '')
      check(qq, '不正确的QQ号码').isNumeric();
  } catch (e) {
    return res.json({success : false, message : e.message});
  }

  try {
    if (homepage && homepage != '')
      check(homepage, '不正确的主页访问地址').isUrl();
  } catch (e) {
    return res.json({success : false, message : e.message});
  }

  Account.findById(req.session.account._id, function(err, account) {
    if (err) return res.json({success : false, message : '发生系统错误'});
    account.base_email = baseEmail;
    account.base_phone = basePhone;
    account.last_name = lastName;
    account.first_name = firstName;
    account.homepage = homepage;
    account.addr = addr;
    account.qq = qq;
    account.photo_path = 'http://www.gravatar.com/avatar/' + _md5(baseEmail);
//    if (!account.card || account.card == '') { // 生成默认名片样式
    account.card = '<img class="card-photo" src="' + account.photo_path + '?size=32" alt="">';
    account.card += "<div class='card-name'>" + account.last_name + ' ' + account.first_name + "</div>";
    if (homepage && homepage != "")
      account.card += "<div class='card-homepage'><a style='font-size: 12px' target='_blank' href='" + account.homepage + "'> 主页地址</a></div>";
    account.card += "<div class='card-mail'>邮箱：" + account.base_email + "</div>";
    account.card += "<div class='card-phone'>电话：" + account.base_phone + "</div>";
//    }
    account.save(function(err) {
      if (err) return res.json({success : false, message : err.message});
      return res.json({success : true, message : '修改个人信息成功'});
    });
  })

}
;

var _errorReturn = function(res, isLogin, errMsg, name, email) {
  console.log(errMsg);
  res.render('reg-login', {login : isLogin, errMsg : errMsg, email : email, name : name});
};

var _md5 = function(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};
var _gen_session = function(account, res) {
  var auth_token = _encrypt(account._id + '\t' + account.name + '\t' + account.password + '\t' + account.base_email, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path : '/', maxAge : 1000 * 60 * 60 * 24 * 7}); //cookie 有效期1周
};
var _encrypt = function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};
var _decrypt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};