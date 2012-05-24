var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var _state = {
  normal : 0, //单向
  friend : 1, //双向好友
  forbid : 2//黑名单
};

var ContactSchema = new Schema({
  owner : {type : ObjectId, ref : 'Account'},
  contacter : {type : ObjectId, ref : 'Account'},
  comment : {type : String}, // 备注
  create_time : {type : Date, 'default' : Date.now}, // 创建时间
  state : {type : Number, 'default' : _state.normal}, // 状态
  pigeonhole : {type : Boolean, 'default' : false}, //归档，默认不归档，等用web端了进行添加标签之后再归档
  tags : [String]
});

mongoose.model('Contact', ContactSchema);
