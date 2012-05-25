var models = require('../../models');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var item = models.Item;
var Account = models.Account;
var Contact = models.Contact;

//获取联系人列表
exports.getContactsList = function(req, res, next) {

  console.log('contact.好友列表: ' + new Date().toLocaleTimeString());

  var accountId = sanitize(req.body.accountId).trim().toLowerCase();

  Contact.find({_owner : accountId})
    .populate('_contacter')
//    .populate('contacter', ['_id', 'base_email', 'base_phone', 'last_name', 'first_name', 'photo_path'])
    .run(function(err, contacts) {
      if (err) return res.json({success : false, message : '系统错误'});
      for (var i in contacts) {
        contacts[i].name = contacts[i].last_name + contacts[i].first_name;
      }
      res.json({success : true, results : JSON.stringify(contacts)});
    });

};

exports.getContactDetail = function(req, res, next) {

  console.log('contact.详细信息 : ' + new Date().toLocaleTimeString());

  var contacterId = sanitize(req.body.contacterId).trim().toLowerCase();

  Account.findById(contacterId, function(err, account) {
    if (err) return res.json({success : false, message : '系统错误'});
    res.json({success : true, accountDetail : JSON.stringify(account)});
  })

};