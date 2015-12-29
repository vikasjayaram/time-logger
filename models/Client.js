var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  //userId: { type: String, default: '' },
  money: {type: String, default: ''},
  numberOfDays: {type: Number, default: 0},
  status: {type: String, default: 'active'},
  createdAt: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Client', clientSchema);
