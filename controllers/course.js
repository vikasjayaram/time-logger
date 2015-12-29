var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Course = require('../models/Course');
var secrets = require('../config/secrets');

/**
 * GET /users
 * Users page.
 */

exports.index = function(req, res) {
  //if (req.user) return res.redirect('/');
  res.render('courses', {
    title: 'Courses'
  });
};


/**
 * POST /new_course
 * Create a new local account.
 * @param email
 * @param password
 */

exports.createCourse = function(req, res, next) {
  req.assert('courseCode', 'Course code cannot be blank').notEmpty();
  req.assert('courseName', 'Course name cannot be blank').notEmpty();
  req.assert('cricosCode', 'CRICOS code cannot be blank').notEmpty();
  req.assert('duration', 'Invalid duration').notEmpty().isInt();
  req.assert('studyPeriod', 'Invalid Study Period').notEmpty();
  req.assert('studyWeeks', 'Invalid Study Weeks').notEmpty().isInt();
  req.assert('tutionFee', 'Invalid Tution Fee').notEmpty();
  req.assert('materialFee', 'Invalid Material Fee').notEmpty();
  req.assert('holidayWeeks', 'Invalid Holiday Weeks').notEmpty().isInt();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/courses');
  }

  var course = new Course(req.body);

  Course.findOne({ courseCode: req.body.courseCode }, function(err, existingCourse) {
    if (existingCourse) {
      req.flash('errors', { msg: 'Course with that course code already exists.' });
      return res.redirect('/courses');
    }
    course.save(function(err) {
      if (err) return next(err);
      res.redirect('/courses');
    });
  });
};
/**
* getCourseList
*/

exports.getCourseList = function (req, res) {
    Course.find({}, function (err, courses) {
        res.json({'aaData': courses});
    });
};
/**
* POST updateCourse
*/
exports.updateCourse = function (req, res, next) {
  Course.findOne(req.body.courseCode, function(err, course) {
    if (err) return next(err);
    course.courseName = req.body.courseName || '';
    course.cricosCode = req.body.cricosCode || '';
    course.duration = req.body.duration || 0;
    course.studyPeriod = req.body.studyPeriod || '';
    course.studyWeeks = req.body.studyWeeks || 0;
    course.tutionFee = req.body.tutionFee || 0;
    course.materialFee = req.body.materialFee || 0;
    course.holidayWeeks = req.body.holidayWeeks || 0;
    course.status = req.body.status || 'active';
    course.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Course information updated.' });
      res.redirect('/courses');
    });
  });

}

/**
 * POST /deleteCourse
 * Delete user account.
 */

exports.deleteCourse = function(req, res, next) {
  Course.remove({ _id: req.body._id }, function(err) {
    if (err) return next(err);
    req.flash('info', { msg: 'Course has been deleted.' });
    res.redirect('/courses');
  });
};