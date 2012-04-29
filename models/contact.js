var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({

  owner_id : {type : ObjectId}, // 用户的ID
  contacter_id : {type : ObjectId}, // 联系人的ID
  contacter_name : {type : String}, //联系人的名字
  comment : {type : String}, // 备注
  create_time : {type : Date, 'default' : Date.now} // 创建时间

});

mongoose.model('Contact', ContactSchema);
