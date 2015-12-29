var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Project = require('../models/Project');
var Client = require('../models/Client');
var secrets = require('../config/secrets');

/**
 * GET /client
 * Client page.
 */

exports.index = function(req, res, err) {
  //if (req.user) return res.redirect('/');
  Client.find({status: 'active'}, function (err, clients) {
    if (err) next(err);
    else {
      res.render('project', {
          title: 'Projects'
      , clients: clients});
    }

  });

};


/**
 * POST /new_course
 * Create a new local account.
 * @param email
 * @param password
 */

exports.newProject = function(req, res, next) {
  req.assert('name', 'Project name cannot be blank').notEmpty();
  //req.assert('money', 'Client amount contributed cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/clients');
  }

  var project = new Project(req.body);
  project.createdBy = req.user.profile.name;
  project.save(function(err) {
    if (err) return next(err);
    res.redirect('/projects');
  });
};

/**
* getCourseList
*/

exports.getAllData = function (req, res) {
    Project.find({}, function (err, clients) {
        console.log(clients);
        res.json({'aaData': clients});
    });
};

/**
* POST updateCourse
*/
exports.edit = function (req, res, next) {
  Project.findOne(req.body._id, function(err, client) {
    if (err) return next(err);
    client.name = req.body.name || '';
    client.clientName = req.body.clientName || '';
    client.status = req.body.status || 'active';
    client.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Project information updated.' });
      res.redirect('/projects');
    });
  });

}

/**
 * POST /delete
 * Delete user account.
 */

exports.del = function(req, res, next) {
  Project.remove({ _id: req.body._id }, function(err) {
    if (err) return next(err);
    req.flash('info', { msg: 'Project has been deleted.' });
    res.redirect('/projects');
  });
};