'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  url: String,
  topic: String,
  body: String
});

module.exports = mongoose.model('Article', ArticleSchema);