/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('login', {
    title: 'Home'
  });
};
