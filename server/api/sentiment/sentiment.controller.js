'use strict';

var _ = require('lodash');
var util = require('util');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('daca9d2d07da11c0a9e7bd1cba99e590b8e6b387');
var request = require('request');
var async = require('async');

var entities;
var sentiment;
var text;
var author;
var textArray = [];
var urlArray = [];
var Sentiment = require('./sentiment.model');


// exports.showArticles = function(req, res){
//   // textArray = [];
//   request("https://www.kimonolabs.com/api/7nwv3q08?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj",
//   function(err, response, body) {
//     // console.log(body);
//     var data = JSON.parse(body);
//     // console.log(data.results);
//     // console.log(body.name);
//     data.results.collection1.forEach(function(el){
//       urlArray.push(el.property1.href);
//     })
//     console.log(urlArray);
//   });
//   urlArray.forEach(function(el){
//     alchemy.text(el, {}, function(err, response){
//       if(err) throw err;
//       text = response.text;
//       textArray.push(text);
//     })
//   })
//   console.log(textArray.length);
//   return res.send(200);
// }

exports.showArticles = function(req, res) {
  var dataJSON,
      dataArr,
      urlArr;

  var kimono = function(done) {
    request('https://www.kimonolabs.com/api/7nwv3q08?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj', function(err, response, body) {
      dataJSON = JSON.parse(body);
      dataArr = dataJSON.results.collection1;
      done(null, 'done doing kimono');
    });
  };

  var mapToUrl = function(done) {
    urlArr = dataArr.map(function(data){
      return data.property1;
    });
    done(null, 'done mapping to URL');
  };

  var getAlchemy = function(done) {
    async.each(urlArr, function(article, callback) {
      alchemy.text(article.href, {}, function(err, response){
        if(err) throw err;
        article.body = response.text;
        console.log(urlArr);
        callback();
      })
    }, function(err){
      if(err) throw err;
      done(null, "done doing alchemy");
    })
  };

  var doneTasks = function(err, results) {
    if (err) throw err;
    console.log(results);
    res.send(urlArr);
  };
  async.series([kimono, mapToUrl, getAlchemy], doneTasks);
};


exports.showText = function(req, res) {
  var url = req.body.url.toString()
  alchemy.text(url, {}, function(err, response){
    if(err) throw err;
    text = response.text;
    console.log(text);
    return res.send(text);
  })
};

exports.showAuthor = function(req, res) {
  console.log('author');
  var url = req.body.url.toString()
  console.log(url);
  alchemy.author(url, {}, function(err, response){
    if(err) throw err;
    console.log(response);
    author = response.author;
    console.log(author);
    return res.send(author);
  })
};

exports.showEntity = function(req, res) {
  var url = req.body.url.toString()
  alchemy.entities(url, {}, function(err, response){
    if(err) throw err;
    console.log(response);
    entities = response.entities;
    return res.send(entities);
  })
};

exports.showSentiment = function(req, res) {
  var url = req.body.url.toString()
  alchemy.sentiment(url, {}, function(err, response){
    if(err) throw err;
    sentiment = response.docSentiment;
    return res.send(sentiment);
  })
};

// Get list of sentiments
exports.index = function(req, res) {
  Sentiment.find(function (err, sentiments) {
    if(err) { return handleError(res, err); }
    return res.json(200, sentiments);
  });
};

// Get a single sentiment
exports.show = function(req, res) {
  Sentiment.findById(req.params.id, function (err, sentiment) {
    if(err) { return handleError(res, err); }
    if(!sentiment) { return res.send(404); }
    return res.json(sentiment);
  });
};

// Creates a new sentiment in the DB.
exports.create = function(req, res) {
  Sentiment.create(req.body, function(err, sentiment) {
    if(err) { return handleError(res, err); }
    return res.json(201, sentiment);
  });
};

// Updates an existing sentiment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sentiment.findById(req.params.id, function (err, sentiment) {
    if (err) { return handleError(res, err); }
    if(!sentiment) { return res.send(404); }
    var updated = _.merge(sentiment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sentiment);
    });
  });
};

// Deletes a sentiment from the DB.
exports.destroy = function(req, res) {
  Sentiment.findById(req.params.id, function (err, sentiment) {
    if(err) { return handleError(res, err); }
    if(!sentiment) { return res.send(404); }
    sentiment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}