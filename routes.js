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

  app.post('/register', account.register);
  app.post('/login', account.login);
  app.post('/logout',site.logout);

  app.post('/changePassword', account.changePassword);
  app.post('/editAccount', account.updateAccount);
  app.post('/randomResults', contact.randomResults);

  app.post('/createCollective', account.createCollective);

  app.post('/addContacts', contact.addContacts);

  // mobile
  app.post('/m/getContacts', mcontact.getContactsList);
  app.post('/m/login', maccount.login);

//  app.post('/a/getContactsList'.mcontact.getContactsList);

  app.post('/homelessContacts', contact.homelessContacts);
  app.post('/myContacts', contact.myContacts);
};
