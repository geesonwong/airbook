/**
 * config
 */

exports.config = {

  port : 4000,

  app : {
    name : '空中电话本'
  },

  title : {
    main : '空中电话本'
  },

  db : 'mongodb://192.168.1.102/airbook',
  session_secret : 'airbook',
  auth_cookie_name : 'airbook'

};
