var models = require('../../models');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var item = models.Item;
var Account = models.Account;
var Contact = models.Contact;

//获取联系人列表
exports.getContactsList = function(req, res, next) {

  console.log('contact.getContactsList : ' + new Date().toLocaleTimeString());

  var accountId = sanitize(req.body.accountId).trim().toLowerCase();

  Contact.find({owner_id : accountId}, function(err, contacts) {
    if (err) return res.json({success : false, message : '系统错误'});
    res.json({success : true, results : JSON.stringify(contacts)});
  });

};