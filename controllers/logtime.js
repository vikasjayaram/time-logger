var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Project = require('../models/Project');
var Client = require('../models/Client');
var User = require('../models/User');
var LogTime = require('../models/LogTime');
var secrets = require('../config/secrets');

/**
 * GET /client
 * Client page.
 */

exports.index = function(req, res, err) {
  //if (req.user) return res.redirect('/');
  async.parallel({
    clients: function (callback) {
        Client.find({status: 'active'}, function (err, clients) {
          callback(err, clients);
        });
    },
    projects: function (callback) {
      Project.find({status: 'active'}, function( err, projects) {
        callback(err, projects);
      });
    },
    users: function (callback) {
      User.find({}, function (err, users) {
        callback(null, users);
      });
    }
  }, function (err, results) {
    console.log(results);
    res.render('logtime', {title: 'Log Time', clients: results.clients, projects: results.projects, users: results.users});
  });
};


/**
 * POST /new_course
 * Create a new local account.
 * @param email
 * @param password
 */

exports.newLogEntry = function(req, res, next) {
  req.assert('name', 'Project name cannot be blank').notEmpty();
  //req.assert('money', 'Client amount contributed cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/logtime');
  }

  var logtime = new LogTime(req.body);
  logtime.save(function(err) {
    if (err) return next(err);
    res.redirect('/logtime');
  });
};

/**
* getCourseList
*/

exports.getAllData = function (req, res) {
    LogTime.find({}, function (err, data) {
        console.log(data);
        res.json({'aaData': data});
    });
};

/**
* POST updateCourse
*/
exports.edit = function (req, res, next) {
  LogTime.findOne(req.body._id, function(err, data) {
    if (err) return next(err);
    data.date = req.body.date || '';
    data.name = req.body.name || '';
    data.clientName = req.body.clientName || '';
    data.projectName = req.body.projectName || '';
    data.hours = req.body.hours || '';
    data.description = req.body.description || '';
    data.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Information updated.' });
      res.redirect('/logtime');
    });
  });

}

/**
 * POST /delete
 * Delete user account.
 */

exports.del = function(req, res, next) {
  LogTime.remove({ _id: req.body._id }, function(err) {
    if (err) return next(err);
    req.flash('info', { msg: 'Log entry has been deleted.' });
    res.redirect('/logtime');
  });
};