exports.accountType = function(type) {
  var _accountType = {
    user : 0,
    group : 1
  }
  return _accountType[type];
};