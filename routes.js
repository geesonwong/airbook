/**
 * Module dependencies.
 */

var site = require('./controllers/site');
var account = require('./controllers/account');
var contact = require('./controllers/contact');
var mcontact = require('./controllers/mobile/contact');
var maccount = require('./controllers/mobile/account');

exports = module.exports = function(app) {

  // home page
  app.get('/', site.index);

  app.get('/register', site.register);
  app.get('/login', site.login, site.index);

  app.post('/register', account.register, site.login);
  app.post('/login', account.login, site.index);
  app.post('/logout', site.logout);

  app.post('/changePassword', account.changePassword);
  app.post('/editAccount', account.updateAccount);
  app.post('/randomUserResults', contact.randomUserResults);

  app.post('/createCollective', account.createGroup);
  app.post('/randomGroupResults', contact.randomGroupResults);

  app.post('/addContacts', contact.addContacts);

  app.post('/myCollective', contact.myCollective);

  app.post('/homelessContacts', contact.homelessContacts);
  app.post('/myContacts', contact.myContacts);
  app.post('/fileContacter', contact.fileContacter);

  // mobile
  app.post('/m/getContacts', mcontact.getContactsList);
  app.post('/m/login', maccount.login);
  app.post('/m/getContactDetail', mcontact.getContactDetail);


};
