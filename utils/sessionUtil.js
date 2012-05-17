exports.md5 = function(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

exports.gen_session = function(account, res) {
  var auth_token = _encrypt(account._id + '\t' + account.name + '\t' + account.password + '\t' + account.base_email, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path : '/', maxAge : 1000 * 60 * 60 * 24 * 7}); //cookie 有效期1周
};

exports.encrypt = function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

exports.decrypt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};