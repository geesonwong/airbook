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

  db : 'mongodb://localhost/airbook',
  session_secret : 'airbook',
  auth_cookie_name : 'airbook'

};
