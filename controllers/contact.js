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

exports.randomResults = function(req, res, next) {
  Account.find({}, function(err, accounts) {//TODO 随机推荐
    if (err) return res.json({success : false, message : '系统错误'});
    res.json({success : true, results : JSON.stringify(accounts)});
  });
};

exports.addContacts = function(req, res, next) {
  var contacts = req.body.contacts;
  var tag = [];
  for (var i in contacts) {
    (function(n) {
      Account.findById(contacts[i], function(err, account) {
        var flag = 1;
        var contact = new Contact();
        contact.owner_id = req.session.account._id;
        contact.contacter_id = account._id;
        contact.contacter_name = account.name;
        contact.contacter_phone = account.base_phone;
        contact.contacter_email = account.base_email;
        if ((contact.owner_id.id == contact.contacter_id.id)) { //判断是否加的是自己
          tag.push(contact.contacter_name);
          flag = 0;
        }
        Contact.findOne({owner_id : contact.owner_id, contacter_id : contact.contacter_id}, function(err, accounts) { //判断是否的加的是自己
          if (err) return res.json({success : false, message : '系统错误'});
          if (accounts) {
            tag.push(contact.contacter_name);
            flag = 0;
          }
          if (flag) {
            contact.save(function(err) {
              if (err) return res.json({success : false, message : '系统错误'});
            })
          }
          if (parseInt(n) == contacts.length - 1) proxy.trigger("v1", tag);
        });
      });
    })(i);
  }
  proxy.trigger("v1", tag);
  var add = function(v1) {
    if (v1.length) {
      var msg = v1.toString() + "添加失败";
      res.json({success : false, message : msg });
    }
    else {
      res.json({success : true, message : "添加成功" });
    }
  };
  proxy.assign("v1", add);
}
;

//未归档联系人
exports.homelessContacts = function(req, res, next) {
  var owner_id = req.session.account._id;
  Contact.find({owner_id : owner_id, pigeonhole : false}, function(err, contacts) {
    if (err) return res.json({success : false, message : '系统错误'});
    if (contacts.length) {
      var _accounts = [];
      for (var i in contacts) {
        (function(n) {
          Account.findById(contacts[i].contacter_id, function(err, account) {
            if (err) return res.json({success : false, message : '系统错误'});
            _accounts.push(account);
            if (parseInt(n) == contacts.length - 1) proxy.trigger("v1", _accounts);
          });
        })(i);
      }
      var post_card = function(v1) {
        if (v1.length) {
          res.json({success : true, results : JSON.stringify(v1)});
        }
        else {
          res.json({success : false, message : '您现在没有未归档的联系人'});
        }
      }
      proxy.assign("v1", post_card);
    }
    else {
      res.json({success : false, message : '您现在没有未归档的联系人'});
    }
  });
};

//我的联系人
exports.myContacts = function(req, res, next) {
  var owner_id = req.session.account._id;
  Contact.find({owner_id : owner_id, pigeonhole : true}, function(err, contacts) {
    if (err) return res.json({success : false, message : '系统错误'});
    console.log(contacts.length)
    if (contacts.length) {
      var _accounts = [];
      for (var i in contacts) {
        (function(n) {
          Account.findById(contacts[i].contacter_id, function(err, account) {
            if (err) return res.json({success : false, message : '系统错误'});
            _accounts.push(account);
            if (parseInt(n) == contacts.length - 1) proxy.trigger("v1", _accounts);
          });
        })(i);
      }
      var post_card = function(v1) {
        if (v1.length) {
          res.json({success : true, results : JSON.stringify(v1)});
        }
        else {
          res.json({success : false, message : '您现在联系人为空'});
        }
      }
      proxy.assign("v1", post_card);
    }
    else {
      res.json({success : false, message : '您现在联系人为空'});
    }
  });
};