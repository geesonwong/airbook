//var mongo = require('mongoskin');
//mongo.db(config.db[1]).

var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function (err) {
  if (err) {
    console.log('connect to db error: ' + err.message);
    process.exit(1);
  }
});

// models
require('./account');
require('./contact');
require('./item');

exports.Account = mongoose.model('Account');
exports.Contact = mongoose.model('Contact');
exports.Item = mongoose.model('Item');