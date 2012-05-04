var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var _accountType = {
  user : 0,
  group : 1
}
/**
 * 账户表，有2种类型（用户和集体），之间用一张中间表联系起来，是多对多关系
 */
var AccountSchema = new Schema({
  name : {type : String}, // 账户名字
  base_email : {type : String}, // 基本邮箱
  base_phone : {type : String}, // 基本电话
  lats_name : {type : String}, // 姓
  first_name : {type : String}, // 名
  photo_path : {type : String}, // 头像地址
  create_time : {type : Date, 'default' : Date.now}, // 创建时间
  type : {type : Number, 'default' : _accountType.user}, //0是个人，1是集体
  card : {type : String}
});

mongoose.model('Account', AccountSchema);
