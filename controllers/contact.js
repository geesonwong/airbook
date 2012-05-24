var models = require('../models');
var Account = models.Account;
var Contact = models.Contact;
var item = models.Item;

//var ObjectId = Schema.ObjectId;

var EventProxy = require('eventproxy').EventProxy;
var proxy = new EventProxy();


var check = require('validator').check;
var sanitize = require('validator').sanitize;
var crypto = require('crypto');

var config = require('../config').config;

// 返回全部结果
exports.randomResults = function(req, res, next) {
  Account.find({}, function(err, accounts) {//TODO 随机推荐
    if (err) return res.json({success : false, message : '系统错误'});
    res.json({success : true, results : JSON.stringify(accounts)});
  });
};

// 添加联系人
exports.addContacts = function(req, res, next) {

  var accountIds = req.body.accounts;
  var failueAccounts = [];
//  var flag = true;

  var add = function(v1) {
    if (v1.length) {
      var msg = v1.toString() + "添加失败";
      res.json({success : false, message : msg });
    } else {
      res.json({success : true, message : "添加成功" });
    }
  };
  proxy.assign("v1", add);

  for (var i in accountIds) {
    // 判断是否加的是自己
    if (req.session.account._id == accountIds[i]) {
      failueAccounts.push(req.session.account.name);
      if (parseInt(i) == accountIds.length - 1)
        proxy.trigger("v1", failueAccounts);
      continue;
    }

    (function(n) {
      // 判断是否已经添加过了
      Contact.findOne({owner : req.session.account._id})
        .populate('contacter', null, {_id : accountIds[i]}).run(function(err, contacter) {
          if (err) return res.json({success : false, message : '系统错误'});
          if (contacter) {
            failueAccounts.push(contacter.contacter.name);
//            flag = false;
            return;
          }
          // 成功了！
          var contact = new Contact();
          contact.owner = req.session.account._id;
          contact.contacter = accountIds[i];
//          if (flag) {
          contact.save(function(err) {
            if (err) return res.json({success : false, message : '系统错误'});
          })
//          }
        });
      if (parseInt(n) == accountIds.length - 1) proxy.trigger("v1", failueAccounts);
    })(i);
  }
  proxy.trigger("v1", failueAccounts);

};

//未归档联系人
exports.homelessContacts = function(req, res, next) {

  var post_card = function(v1) {
    if (v1.length) {
      res.json({success : true, results : JSON.stringify(v1)});
    }
  };
  proxy.assign("v1", post_card);

  Contact.find({owner : req.session.account._id, pigeonhole : false})
    .populate('contacter').run(function(err, contacts) {
      if (err) {
        console.log(err.message);
        return res.json({success : false, message : '系统错误'});
      }
      var accounts = [];
      if (contacts.length) {
        for (var i in contacts) {
          accounts.push(contacts[i].contacter);
        }
        proxy.trigger("v1", accounts);
      } else {
        res.json({success : false, message : '您现在没有未归档的联系人'});
      }
    });
};

//已归档联系人
exports.myContacts = function(req, res, next) {

  var post_card = function(v1) {
    if (v1.length) {
      res.json({success : true, results : JSON.stringify(v1)});
    }
  };
  proxy.assign("v1", post_card);

  Contact.find({owner : req.session.account._id, pigeonhole : true})
    .populate('contacter').run(function(err, contacts) {
      if (err) return res.json({success : false, message : '系统错误'});
      var accounts = [];
      if (contacts.length) {
        for (var i in contacts) {
          accounts.push(contacts.contacter);
        }
        proxy.trigger("v1", accounts);
      } else {
        res.json({success : false, message : '您现在联系人为空'});
      }
    });

};