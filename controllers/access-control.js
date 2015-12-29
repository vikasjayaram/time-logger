/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('access-control/403', {
    title: '403 - Forbidden'
  });
};
