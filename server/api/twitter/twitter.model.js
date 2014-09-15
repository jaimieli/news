'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TwitterSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Twitter', TwitterSchema);