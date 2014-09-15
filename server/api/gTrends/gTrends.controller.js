'use strict';

var _ = require('lodash');
var Gtrends = require('./gTrends.model');
var request = require('request');
var async = require('async');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('292dd0f8f636420d89276c2ae42759faecdc61a9');

exports.getArticle = function(req, res) {
  var dataJSON,
      dataArr,
      urlArr
  var topic = req.body.property1.text;
  topic = topic.replace(' ', '+');
  topic.toString();

  var kimono = function(done) {
    var url = 'https://www.kimonolabs.com/api/46zne256?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic;
    request('https://www.kimonolabs.com/api/46zne256?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic, function(err, response, body) {
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
        callback();
      })
    }, function(err){
      if(err) throw err;
      done(null, "done doing alchemy");
    })
  };

  var getSentiment = function(done) {
    async.each(urlArr, function(article, callback) {
      alchemy.sentiment(article.href, {}, function(err, response){
        if(err) throw err;
        article.sentiment = response.docSentiment;
        callback();
      })
    }, function(err){
      if(err) throw err;
      done(null, "done doing sentiment");
    })
  };
  var doneTasks = function(err, results) {
    if (err) throw err;
    // console.log(urlArr);
    res.send(urlArr[0]);
  };

  async.series([kimono, mapToUrl, getAlchemy, getSentiment], doneTasks);
};

exports.trends = function(req, res) {
  var dataJSON,
      dataArr

  var kimono = function(done) {
    request('https://www.kimonolabs.com/api/4izw7jzk?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj', function(err, response, body) {
      dataJSON = JSON.parse(body);
      dataArr = dataJSON.results.collection1;
      done(null, 'done doing kimono');
    });
  };
  var doneTasks = function(err, results) {
    if (err) throw err;
    // console.log(urlArr);
    res.send(dataArr);
  };

  async.series([kimono], doneTasks);
}
// Get list of gTrendss
exports.index = function(req, res) {
  Gtrends.find(function (err, gTrendss) {
    if(err) { return handleError(res, err); }
    return res.json(200, gTrendss);
  });
};

// Get a single gTrends
exports.show = function(req, res) {
  Gtrends.findById(req.params.id, function (err, gTrends) {
    if(err) { return handleError(res, err); }
    if(!gTrends) { return res.send(404); }
    return res.json(gTrends);
  });
};

// Creates a new gTrends in the DB.
exports.create = function(req, res) {
  Gtrends.create(req.body, function(err, gTrends) {
    if(err) { return handleError(res, err); }
    return res.json(201, gTrends);
  });
};

// Updates an existing gTrends in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gtrends.findById(req.params.id, function (err, gTrends) {
    if (err) { return handleError(res, err); }
    if(!gTrends) { return res.send(404); }
    var updated = _.merge(gTrends, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, gTrends);
    });
  });
};

// Deletes a gTrends from the DB.
exports.destroy = function(req, res) {
  Gtrends.findById(req.params.id, function (err, gTrends) {
    if(err) { return handleError(res, err); }
    if(!gTrends) { return res.send(404); }
    gTrends.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}