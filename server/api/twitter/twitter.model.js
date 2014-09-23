'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TwitterSchema = new Schema({
  data: {}
});

module.exports = mongoose.model('Twitter', TwitterSchema);