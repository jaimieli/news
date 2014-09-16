'use strict';

var _ = require('lodash');
var Gnew = require('./gNew.model');
var request = require('request');
var async = require('async');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('a1fba049c2c8165b04e481a61b9ce0bf8ae56eb2');
var wikipedia = require('wikipedia-js');

exports.getArticle = function(req, res) {
  var dataJSON1,
      dataArr1,
      dataJSON2,
      dataArr2,
      dataJSON3,
      dataArr3,
      dataArrColl = [],
      cleanData,
      context;
  var query = req.body.property1.text;
  var topic = req.body.property1.text;
  topic = topic.replace(' ', '+');
  topic.toString();

  var kimonoNews = function(done){
      request('https://www.kimonolabs.com/api/b2ij5qoa?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic+'&oq='+topic, function(err, response, body) {
        dataJSON1 = JSON.parse(body);
        dataArrColl = dataJSON1.results.collection1;
        done(null, "done doing kimono");
      });
    };

  var mapToClean = function(done) {
    cleanData = dataArrColl.map(function(data){
        return data.property1;
      });
    done(null, 'done mapping to URL');
  };

  var getAlchemy = function(done){
    var getArticleText = function(callback) {
      async.each(cleanData, function(article, callback) {
        alchemy.text(article.href, {}, function(err, response){
          if(err) console.log(err);
          article.body = response.text;
          callback();
        })
      }, function(err){
        if(err) console.log(err);
        callback();
      })
    };

    var getSentiment = function(callback) {
      async.each(cleanData, function(article, callback) {
        alchemy.sentiment(article.href, {}, function(err, response){
          if(err) console.log(err);
          article.docSentiment = response.docSentiment;
          article.docSentiment.score = Number(article.docSentiment.score);
          callback();
        })
      }, function(err){
        if(err) console.log(err);
        callback();
      })
    };
    var getEntitySentiment = function(callback) {
      async.each(cleanData, function(article, callback) {
        alchemy.entities(article.href, {sentiment: 1, maxRetrieve: 10}, function(err, response){
          if(err) console.log(err);
          // article.entities = response.entities;
          article.entitySentiment = [];
          article.entities = [];
          article.scores = [];

          response.entities.forEach(function(el){
            var score = el.sentiment.score || "0";
            var entity = el.text;
            var obj = {};
            obj[entity] = Number(score);
            article.entitySentiment.push(obj);
            article.entities.push(entity);
            article.scores.push(Number(score));
          })
          // article.entities.forEach(function(el){
          //   article.entitiesArr.push(el.text)
          // })
          callback();
        })
      }, function(err){
        if(err) console.log(err);
        callback();
      })
    };

    async.parallel([getArticleText, getSentiment, getEntitySentiment],
      function(err, results){
      if(err) console.log(err);
      done(null, "done doing alchemy");
    })
  }

  var getWiki = function(done) {
    var options = {query: query, 'format': 'html', summaryOnly: true};
    wikipedia.searchArticle(options, function(err, htmlWikiText) {
      if(err) console.log(err);
      if (htmlWikiText === null) {
        htmlWikiText = "Not available";
      }
      cleanData.push({context: htmlWikiText});
      cleanData.push({topic: query});
      done(null, "done doing wiki");
    })
  };

  var doneTasks = function(err, results) {
    if(err) console.log(err);
    console.log(results);
    // res.send(cleanData[0]);
    res.send(cleanData);
  };

  // async.series([kimonoFox, kimonoReuters, kimonoHuff, mapToClean, getArticleText, getSentiment, getEntitySentiment, getWiki], doneTasks);
  async.series([kimonoNews, mapToClean, getAlchemy, getWiki], doneTasks);
};

exports.showEntity = function(req, res) {
  var url = req.body.href.toString();
  var entities;
  alchemy.entities(url, {sentiment: 1, maxRetrieve: 10}, function(err, response){
    if(err) console.log(err);
    console.log(response);
    entities = response.entities;
    return res.send(entities);
  })
};

// Get list of gNews
exports.index = function(req, res) {
  Gnew.find(function (err, gNews) {
    if(err) { return handleError(res, err); }
    return res.json(200, gNews);
  });
};

// Get a single gNew
exports.show = function(req, res) {
  Gnew.findById(req.params.id, function (err, gNew) {
    if(err) { return handleError(res, err); }
    if(!gNew) { return res.send(404); }
    return res.json(gNew);
  });
};

// Creates a new gNew in the DB.
exports.create = function(req, res) {
  Gnew.create(req.body, function(err, gNew) {
    if(err) { return handleError(res, err); }
    return res.json(201, gNew);
  });
};

// Updates an existing gNew in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gnew.findById(req.params.id, function (err, gNew) {
    if (err) { return handleError(res, err); }
    if(!gNew) { return res.send(404); }
    var updated = _.merge(gNew, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, gNew);
    });
  });
};

// Deletes a gNew from the DB.
exports.destroy = function(req, res) {
  Gnew.findById(req.params.id, function (err, gNew) {
    if(err) { return handleError(res, err); }
    if(!gNew) { return res.send(404); }
    gNew.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}