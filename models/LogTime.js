var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var logTimeSchema = new mongoose.Schema({
  date: {type: Date},
  name: { type: String, default: '' },
  clientName: {type: String, default: ''},
  projectName: {type: String, default: ''},
  hours: {type: String, default: ''},
  description: {type: String, default: ''},
});

module.exports = mongoose.model('LogTime', logTimeSchema);
