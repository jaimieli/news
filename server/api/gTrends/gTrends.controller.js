'use strict';

var _ = require('lodash');
var Gtrends = require('./gTrends.model');
var request = require('request');
var async = require('async');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('292dd0f8f636420d89276c2ae42759faecdc61a9');

exports.getArticle = function(req, res) {
  var dataJSON1,
      dataArr1,
      dataJSON2,
      dataArr2,
      dataJSON3,
      dataArr3,
      dataArrColl = [],
      urlArr;

  var topic = req.body.property1.text;
  topic = topic.replace(' ', '+');
  topic.toString();

  // fox
  var kimonoFox = function(done) {
    request('https://www.kimonolabs.com/api/46zne256?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic, function(err, response, body) {
      dataJSON1 = JSON.parse(body);
      dataArr1 = dataJSON1.results.collection1;
      dataArrColl.push(dataArr1);
      done(null, 'done doing kimono Fox');
    });
  };

  // reuters
  var kimonoReuters = function(done) {
    request('https://www.kimonolabs.com/api/eijqesc4?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&blob='+topic, function(err, response, body) {
      dataJSON2 = JSON.parse(body);
      dataArr2 = dataJSON2.results.collection1;
      dataArrColl.push(dataArr2);
      done(null, 'done doing kimono Reuters');
    });
  };

  // huffpost
  var kimonoHuff = function(done) {
    request('https://www.kimonolabs.com/api/35kicyte?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&kimpathw='+topic, function(err, response, body) {
      dataJSON3 = JSON.parse(body);
      dataArr3 = dataJSON3.results.collection1;
      dataArrColl.push(dataArr3);
      done(null, 'done doing kimono Huff');
    });
  };


  var mapToUrl = function(done) {
    urlArr = dataArrColl.map(function(data){
        return data[0].property1;
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
    // res.send(urlArr[0]);
    res.send(urlArr);
  };

  // async.series([kimono, mapToUrl, getAlchemy, getSentiment], doneTasks);
  async.series([kimonoFox, kimonoReuters, kimonoHuff, mapToUrl, getAlchemy, getSentiment], doneTasks);
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