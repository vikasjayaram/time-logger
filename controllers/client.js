var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Client = require('../models/Client');
var secrets = require('../config/secrets');

/**
 * GET /client
 * Client page.
 */

exports.index = function(req, res) {
  //if (req.user) return res.redirect('/');
  res.render('client', {
    title: 'Clients'
  });
};


/**
 * POST /new_course
 * Create a new local account.
 * @param email
 * @param password
 */

exports.newClient = function(req, res, next) {
  req.assert('name', 'Client name cannot be blank').notEmpty();
  req.assert('money', 'Client amount contributed cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/clients');
  }

  var client = new Client(req.body);
  client.save(function(err) {
    if (err) return next(err);
    res.redirect('/clients');
  });
};

/**
* getCourseList
*/

exports.getAllData = function (req, res) {
    Client.find({}, function (err, clients) {
        console.log(clients);
        res.json({'aaData': clients});
    });
};

/**
* POST updateCourse
*/
exports.edit = function (req, res, next) {
  Client.findOne(req.body._id, function(err, client) {
    if (err) return next(err);
    client.name = req.body.name || '';
    client.money = req.body.money || '';
    client.status = req.body.status || 'active';
    client.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Client information updated.' });
      res.redirect('/clients');
    });
  });

}

/**
 * POST /delete
 * Delete user account.
 */

exports.del = function(req, res, next) {
  Client.remove({ _id: req.body._id }, function(err) {
    if (err) return next(err);
    req.flash('info', { msg: 'Client has been deleted.' });
    res.redirect('/clients');
  });
};