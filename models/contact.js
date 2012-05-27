var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  _owner : {type : Schema.ObjectId, ref : 'Account'},
  _contacter : {type : Schema.ObjectId, ref : 'Account'},
  comment : {type : String}, // 备注
  create_time : {type : Date, 'default' : Date.now}, // 创建时间
  state : {type : Number, 'default' : 0}, // 状态
  pigeonhole : {type : Boolean, 'default' : false}, //归档，默认不归档，等用web端了进行添加标签之后再归档
  tags : [String]
});

mongoose.model('Contact', ContactSchema, 'contacts');
