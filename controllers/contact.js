var models = require('../models');
var Account = models.Account;
var Contact = models.Contact;
var item = models.Item;

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
    Account.findById(contacts[i], function(err, account) {
      var contact = new Contact();
      contact.owner_id = req.session.account._id;
      contact.contacter_id = account._id;
      contact.contacter_name = account.name;
      if ((contact.owner_id.id == contact.contacter_id.id) || Account.findOne({'owner_id' : contact.owner_id, '_id' : contact.contacter_id })) {
        tag.push(contact.contacter_name);
        proxy.trigger("v1", tag);
        return;
      }
      contact.contacter_phone = account.base_phone;
      contact.contacter_email = account.base_email;
      contact.save(function(err) {
        if (err) return res.json({success : false, message : '系统错误'});
      });
    });
  }
  var add = function(v1) {
    if (!v1.length) {
      res.json({success : true, message : '添加联系人成功'});
    }
    else {
      var msg = v1.toString() + "添加失败";
      res.json({success : false, message : msg });
    }
  };
  proxy.assign("v1", add);
};