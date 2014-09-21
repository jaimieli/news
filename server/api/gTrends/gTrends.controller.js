'use strict';

var _ = require('lodash');
var Gtrends = require('./gTrends.model');
var request = require('request');
var async = require('async');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('daca9d2d07da11c0a9e7bd1cba99e590b8e6b387');
var wikipedia = require('wikipedia-js');
// var apiKey = 'z6FF2XkTfAGuyA41WZwEnGtJs8lsIAyW';
// var newsQuery = require('newsquery')(apiKey);

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
    var kimonoFox = function(callback) {
      request('https://www.kimonolabs.com/api/46zne256?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic, function(err, response, body) {
        dataJSON1 = JSON.parse(body);
        dataArr1 = dataJSON1.results.collection1;
        dataArrColl.push(dataArr1);
        callback();
      });
    };
    var kimonoReuters = function(callback) {
      request('https://www.kimonolabs.com/api/eijqesc4?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&blob='+topic, function(err, response, body) {
        dataJSON2 = JSON.parse(body);
        dataArr2 = dataJSON2.results.collection1;
        dataArrColl.push(dataArr2);
        callback();
      });
    };
    var kimonoHuff = function(callback) {
      request('https://www.kimonolabs.com/api/6ops0ryg?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic, function(err, response, body) {
        dataJSON3 = JSON.parse(body);
        dataArr3 = dataJSON3.results.collection1;
        dataArrColl.push(dataArr3);
        callback();
      });
    };
    async.parallel([kimonoFox, kimonoReuters, kimonoHuff],
      function(err, results){
      if(err) console.log(err);
      done(null, "done doing kimono");
    })
  }
  // fox
  // var kimonoFox = function(done) {
  //   request('https://www.kimonolabs.com/api/46zne256?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic, function(err, response, body) {
  //     dataJSON1 = JSON.parse(body);
  //     dataArr1 = dataJSON1.results.collection1;
  //     dataArrColl.push(dataArr1);
  //     done(null, 'done doing kimono Fox');
  //   });
  // };

  // reuters
  // var kimonoReuters = function(done) {
  //   request('https://www.kimonolabs.com/api/eijqesc4?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&blob='+topic, function(err, response, body) {
  //     dataJSON2 = JSON.parse(body);
  //     dataArr2 = dataJSON2.results.collection1;
  //     dataArrColl.push(dataArr2);
  //     done(null, 'done doing kimono Reuters');
  //   });
  // };

  // huffpost
  // var kimonoHuff = function(done) {
  //   request('https://www.kimonolabs.com/api/6ops0ryg?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj&q='+topic, function(err, response, body) {
  //     dataJSON3 = JSON.parse(body);
  //     dataArr3 = dataJSON3.results.collection1;
  //     dataArrColl.push(dataArr3);
  //     done(null, 'done doing kimono Huff');
  //   });
  // };


  var mapToClean = function(done) {
    cleanData = dataArrColl.map(function(data){
        return data[0].property1;
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
          article.sentiment = response.docSentiment;
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
          article.entities = response.entities;
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
    if(err) console.log(err);
    // console.log(urlArr);
    // console.log(dataArr);
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