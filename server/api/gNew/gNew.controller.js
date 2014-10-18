'use strict';

var _ = require('lodash');
var Gnew = require('./gNew.model');
var request = require('request');
var async = require('async');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('444606205f63cf2a1943e4071ba69cc6500d7b7d');
var wikipedia = require('wikipedia-js');
var _ = require('underscore');

exports.getArticle = function(req, res) {
  var dataJSON1,
      dataArr1,
      dataJSON2,
      dataArr2,
      dataJSON3,
      dataArr3,
      dataArrColl = [],
      cleanData,
      context,
      dataObj = {},
      docSentimentSum,
      docSentimentArr;
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
      docSentimentSum = 0;
      docSentimentArr = [];
      async.each(cleanData, function(article, callback) {
        alchemy.sentiment(article.href, {}, function(err, response){
          if (response.docSentiment) {
            if(err) console.log(err);
            article.docSentiment = response.docSentiment;
            article.docSentiment.score = Number(article.docSentiment.score);
            if(article.docSentiment.score === NaN) {
              article.docSentiment.score = 0;
            }
            docSentimentSum += Number(article.docSentiment.score);
            docSentimentArr.push(Number(article.docSentiment.score))
            // console.log('article.docSentiment.score: ', article.docSentiment.score);
            // console.log('docSentimentSum: ', docSentimentSum)
          }
          callback();
        })
      }, function(err){
        if(err) console.log(err);
        callback();
      })
    };
    var getEntitySentiment = function(callback) {
      dataObj.sentimentData = {};
      async.each(cleanData, function(article, callback) {
        alchemy.entities(article.href, {sentiment: 1, maxRetrieve: 10}, function(err, response){
          if(err) console.log(err);
          // article.entities = response.entities;
          article.entitySentiment = [];
          article.entities = [];
          article.scores = [];

          response.entities.forEach(function(el){
            if (el.sentiment) {
              var score = el.sentiment.score || "0";
              var entity = el.text;
              var obj = {};

              // data cleaning --> sentimentData obj
              var sentimentObj = {};
              sentimentObj["score"]= score;
              sentimentObj["source"]= article.href;
              sentimentObj["frequency"] = el.count;
              sentimentObj["type"] = el.sentiment.type;
              if (!dataObj.sentimentData[entity]) {
                dataObj.sentimentData[entity] = [];
              }
              dataObj.sentimentData[entity].push(sentimentObj);
              // end of data cleaning
              obj['entity'] = entity;
              obj['score'] = Number(score);
              obj['frequency'] = el.count;
              obj['type'] = el.sentiment.type;
              article.entitySentiment.push(obj);
              article.entities.push(entity);
              article.scores.push(Number(score));
            }
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
      // make an array
      var arr = [];
      // loop over the keys of dataObj.sentimentData
      for (var key in dataObj.sentimentData){
        // if (dataObj.hasOwnProperty(key)) {
        //   console.log("hey i gets to be run");
          var obj = {};
          obj.entity = key;
          obj.sentimentScores = dataObj.sentimentData[key];
          arr.push(obj);
      }
      // sort arr according to the number of sentimentScores
       var sortedArr = arr.sort(function(a,b){
        if(a.sentimentScores.length > b.sentimentScores.length) {
          return -1;
        }
        if(a.sentimentScores.length < b.sentimentScores.length) {
          return 1;
        }
        return 0;
      });

      dataObj.sentimentData = sortedArr.slice(0,10);
      done(null, "done doing alchemy");
    })
  }

  var getSourcesAndWiki = function(done){
    var getSources = function(callback) {
      function getHostName(url) {
          var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
          if (match != null && match.length > 2 &&
              typeof match[2] === 'string' && match[2].length > 0) {
          return match[2];
          }
          else {
              return null;
          }
      }
      dataObj.sources = [];
      var counter = 1;
      cleanData.forEach(function(el){
        var sourceObj = {};
        sourceObj['label'] = el.href;
        sourceObj['id'] = counter
        sourceObj['cleanLabel'] = getHostName(el.href);
        el['cleanLabel'] = getHostName(el.href);
        if (el.docSentiment) {
          if (el.docSentiment.score === null) {
            el.docSentiment.score = 0;
          }
          sourceObj['docSentiment'] = el.docSentiment.score;
          counter++;
          dataObj.sources.push(sourceObj);
        }
      })
      var hash = {};
      dataObj.sources.forEach(function(el){
        if (hash[el.cleanLabel] === undefined) {
          hash[el.cleanLabel] = [];
        }
        hash[el.cleanLabel].push(el.label);
        if (hash[el.cleanLabel].length > 1) {
          el.cleanLabel = el.cleanLabel + ' ' + hash[el.cleanLabel].length;
        }
      });
      var hash2 = {};
      cleanData.forEach(function(el){
        if (hash2[el.cleanLabel] === undefined) {
          hash2[el.cleanLabel] = [];
        }
        hash2[el.cleanLabel].push(el.label);
        if (hash2[el.cleanLabel].length > 1) {
          el.cleanLabel = el.cleanLabel + ' ' + hash2[el.cleanLabel].length;
        }
      })
      callback();
    };

    var getWiki = function(callback) {
      var options = {query: query, 'format': 'html', summaryOnly: true};
      wikipedia.searchArticle(options, function(err, htmlWikiText) {
        if(err) console.log(err);
        if (htmlWikiText === null) {
          htmlWikiText = "Not Available";
        }
        dataObj.wiki = [];
        var wikiObj = {};
        wikiObj['context'] = htmlWikiText;
        dataObj.wiki.push(wikiObj);
        dataObj.topic = query;
        callback();
      })
    };
    async.parallel([getSources, getWiki],
      function(err, results){
      if(err) console.log(err);
      done(null, "done doing sources and wiki");
    })
  }

  var doneTasks = function(err, results) {
    if(err) console.log(err);
    dataObj.cleanData = cleanData;
    dataObj.docSentimentAvg = Math.round(docSentimentSum/dataObj.cleanData.length * 10) / 10;
    var max = Math.max.apply(null, docSentimentArr);
    dataObj.docSentimentMax = Math.round(max * 10) / 10;
    var min = Math.min.apply(null, docSentimentArr);
    dataObj.docSentimentMin = Math.round(min * 10) / 10;
    res.send(dataObj);
  };

  // async.series([kimonoFox, kimonoReuters, kimonoHuff, mapToClean, getArticleText, getSentiment, getEntitySentiment, getWiki], doneTasks);
  async.series([kimonoNews, mapToClean, getAlchemy, getSourcesAndWiki], doneTasks);
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