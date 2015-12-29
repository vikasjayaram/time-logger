var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  status: {type: String, default: 'active'},
  clientName: { type: String, default: '' },
  createdBy: {type: String, default: ''},
  createdAt: {type: Date, default: Date.now()}

});

module.exports = mongoose.model('Project', projectSchema);
