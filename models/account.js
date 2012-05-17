var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var _accountType = {
  user : 0,
  group : 1
};

// 处理方法
var _setAccountType = function(typeString) {
  return _accountType[typeString];
};

var _getAccountType = function(typeNumber) {
  for (i in _accountType) {
    if (_accountType[i] == typeNumber)
      return i;
  }
};



/**
 * 账户表，有2种类型（用户和集体），之间用一张中间表联系起来，是多对多关系
 */
var AccountSchema = new Schema({
  name : {type : String, required : true, index : true, unique : true}, // 账户名字
  password : {type : String}, //账户密码
  base_email : {type : String, required : true, unique : true}, // 基本邮箱
  base_phone : {type : String}, // 基本电话
  last_name : {type : String}, // 姓
  first_name : {type : String}, // 名
  photo_path : {type : String}, // 头像地址
  create_time : {type : Date, 'default' : Date.now}, // 创建时间
  type : {type : Number, 'default' : _accountType.user, set : _setAccountType, get : _getAccountType}, //0是个人，1是集体
  card : {type : String}
});

// 中间件
AccountSchema.pre('save',function(next){
//  this.
});

mongoose.model('Account', AccountSchema);
