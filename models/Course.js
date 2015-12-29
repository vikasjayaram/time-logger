var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var courseSchema = new mongoose.Schema({
  courseCode: { type: String, unique: true},
  courseName: String,

  cricosCode: String,
  duration: Number,
  studyPeriod: String,
  studyWeeks: Number,
  tutionFee: Number,
  holidayWeeks: Number,
  materialFee: Number,
  status: {type: String, default: 'active'},
});

module.exports = mongoose.model('Course', courseSchema);
