exports.accountType = function(type) {
  var _accountType = {
    user : 0,
    group : 1
  }
  return _accountType[type];
};

exports.stateType = function(type) {
  var _state = {
    normal : 0, //单向
    friend : 1, //双向好友
    forbid : 2//黑名单
  }
  return _state[type];
};