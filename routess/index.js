/*
 * GET home page.
 */

exports.index = function (req, res) {
  console.log('here');
  res.render('index', { title : 'Express' })
};