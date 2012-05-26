var models = require('../models');
var constant = require('../utils/constant');
var Account = models.Account;
var Contact = models.Contact;
var item = models.Item;

//var ObjectId = Schema.ObjectId;

var EventProxy = require('eventproxy').EventProxy;


var check = require('validator').check;
var sanitize = require('validator').sanitize;

var config = require('../config').config;
var constant = require('../utils/constant');

// 返回全部用户结果
exports.randomUserResults = function(req, res, next) {
  Account.find({type : constant.accountType('user')}, function(err, accounts) {
    if (err) return res.json({success : false, message : '系统错误'});
    if (accounts && accounts.length)
      res.json({success : true, type : 'account', results : JSON.stringify(accounts)});
    else
      res.json({success : false, message : '当前系统没有用户'});
  });
};

// 返回全部集体结果
exports.randomGroupResults = function(req, res, next) {
  Account.find({type : constant.accountType('group')}, function(err, accounts) {
    if (err) return res.json({success : false, message : '系统错误'});
    if (accounts && accounts.length)
      res.json({success : true, type : 'account', results : JSON.stringify(accounts)});
    else
      res.json({success : false, message : '当前系统没有集体'});
  });
};

// 添加联系人
exports.addContacts = function(req, res, next) {


  var proxy = new EventProxy();

  var accountIds = req.body.accounts;
  var failueAccounts = [];

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
      Contact.find({_owner : req.session.account._id})
        .populate('_contacter', ['_id', 'name']).run(function(err, contacts) {
          if (err) console.log(err.message);
          for (var j in contacts) {
            if (contacts[j]._contacter._id == accountIds[n]) {
              failueAccounts.push(contacts[j]._contacter.name);
              if (parseInt(n) == accountIds.length - 1)
                proxy.trigger("v1", failueAccounts);
              return;
            }
          }
          // 成功
          var contact = new Contact();
          contact._owner = req.session.account._id;
          contact._contacter = accountIds[n];
          contact.save(function(err) {
            if (err) return res.json({success : false, message : '系统错误'});
            if (parseInt(n) == accountIds.length - 1) proxy.trigger("v1", failueAccounts);
          })
//          Account.findById(req.session.account._id, function(err, account) {
//            account._contacts.push(contact);
//            account.save();
//          })
        });
    })(i);
  }
};

//未归档联系人
exports.homelessContacts = function(req, res, next) {

  var proxy = new EventProxy();

  var post_card = function(v1) {
    if (v1.length) {
      res.json({success : true, type : 'contact', results : JSON.stringify(v1)});
    }
  };
  proxy.assign("v1", post_card);

  Contact.find({_owner : req.session.account._id, pigeonhole : false})
    .populate('_contacter').run(function(err, contacts) {
      if (err) return res.json({success : false, message : '系统错误'});
      var accounts = [];
      if (contacts.length) {
//        for (var i in contacts) {
//          accounts.push(contacts[i]._contacter);
//        }
//        proxy.trigger("v1", accounts);
        proxy.trigger("v1", contacts);
      } else {
        res.json({success : false, message : '您没有未归档的联系人'});
      }
    });
};

//已归档联系人
exports.myContacts = function(req, res, next) {

  var proxy = new EventProxy();

  var post_card = function(v1) {
    if (v1.length) {
      res.json({success : true, results : JSON.stringify(v1)});
    }
  };
  proxy.assign("v1", post_card);

  Contact.find({_owner : req.session.account._id, pigeonhole : true})
    .populate('_contacter').run(function(err, contacts) {
      if (err) return res.json({success : false, message : '系统错误'});
      var accounts = [];
      if (contacts.length) {
//        for (var i in contacts) {
//          accounts.push(contacts[i]._contacter);
//        }
//        proxy.trigger("v1", accounts);
        proxy.trigger("v1", contacts);
      } else {
        res.json({success : false, message : '您现在联系人为空'});
      }
    });

};

//我的集体
exports.myCollective = function(req, res, next) {
  Account.find({creator_id : req.session.account._id, type : constant.accountType('group')})
    .run(function(err, accounts) {
      if (err) return res.json({success : false, message : '系统错误'});
      if(!accounts.length){
        return res.json({success : false,message : '您还没有创建过群哦'});
      }
      return res.json({success : true, type : 'account', results : JSON.stringify(accounts)});
    });
};

exports.fileContacter = function(req, res, next) {

  var contactId = sanitize(req.body.contactid).trim();
  contactId = sanitize(contactId).xss();
  var comment = sanitize(req.body.comment).trim();
  comment = sanitize(comment).xss();
  var tags = sanitize(req.body.tag).trim();
  tags = sanitize(tags).xss();

  Contact.findById(contactId, function(err, contact) {
    if (err) return res.json({success : false, message : '系统错误'});

    tags = tags.split(' ');

    contact.pigeonhole = true;//归档
    contact.comment = comment;
    contact.tags = tags;

    contact.save(function(err) {
      if (err) return res.json({success : false, message : '系统错误'});
      return res.json({success : true, message : '执行成功'});
    })

  });

};

exports.findByTags = function(req, res, next) {

  var tags = sanitize(req.body.tags).trim();
  tags = sanitize(tags).xss();

  Contact.find()

};