var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


/**
 * 条目表，用户自定义自己的条目
 */
var ItemSchema = new Schema({

  account_id : {type : ObjectId}, //所属的账户ID
  key : {type : String}, //条目键，比方说：公司电话
  value : {type : String}// 条目值，比方说：8888888

});

mongoose.model('Item', ItemSchema);
