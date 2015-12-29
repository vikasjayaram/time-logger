var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Course = require('../models/Course');
var status = "active";
/**
 * GET /
 * Application page.
 */

exports.index = function(req, res) {
    // Course.find({'status': status}, function (err, courses) {
    //     //res.json({'aaData': courses});
    //     console.log(courses);
    //     res.render('application', {
    //       title: 'Application',
    //       courses: courses
    //     });
    // });
	if (req.user) res.redirect('/home');
	else res.redirect('/login');
};
