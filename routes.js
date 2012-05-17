/**
 * Module dependencies.
 */

var site = require('./controllers/site');
var account = require('./controllers/account');
var contact = require('./controllers/contact');

exports = module.exports = function(app) {

  // home page
  app.get('/', site.index);

  app.get('/register', site.register);
  app.get('/login', site.login, site.index);

  app.post('/register', account.register);
  app.post('/login', account.login);

  app.post('/changePassword', account.changePassword);
  app.post('/editAccount', account.updateAccount);
  app.post('/randomResults', contact.randomResults);

};
