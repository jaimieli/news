'use strict';

var _ = require('lodash');
var Twitter = require('./twitter.model');



// Twitter integration
// var Twit = require('twit');
// var T = new Twit({
//     consumer_key: '1kwdL3JfIXRkewB9QLYenyfCk',
//     consumer_secret: 'iECmGxKMEAg6Yt4nBbtK8l1KT8WcD6GDizNxoWuBo5AZsDEApu',
//     access_token: '816844254-CQnlnuoy9hHHjiEJ0r35ecWjZ5AF8I2xZWxF6RsL',
//     access_token_secret: 'hgPEbH5efQerj38DA78BDbNpXocDeOcgQrIidJP5nf71t'
// })

var twitter = require('ntwitter');
var twit = new twitter({
      consumer_key: '1kwdL3JfIXRkewB9QLYenyfCk',
      consumer_secret: 'iECmGxKMEAg6Yt4nBbtK8l1KT8WcD6GDizNxoWuBo5AZsDEApu',
      access_token_key: '816844254-CQnlnuoy9hHHjiEJ0r35ecWjZ5AF8I2xZWxF6RsL',
      access_token_secret: 'hgPEbH5efQerj38DA78BDbNpXocDeOcgQrIidJP5nf71t'
})

// exports.trends = function(req, res) {
//   var woeid = req.params.woeid;
//   T.get('trends/place', {id: woeid}, function(err, data) {
//     if (typeof data === "undefined") {
//       res.json({status: false});
//     } else {
//       res.json({trends: data, status: true});
//     }
//   });
// }

exports.search = function(socket) {
  return function(req, res, next) {
  // console.log('i am in the twitter search fucntion');
  // var stream = T.stream('statuses/filter', { track: 'mango' })

  // stream.on('tweet', function (tweet) {
  //   console.log('this is a tweet: ', tweet);
  //   return res.json(200, tweet)

  // })

  // twittery query interest passed in from the front tend trend
  var interest = req.body.property1.text;

    // possibly doing an 'or' search with location
    // {track: interests, language: 'en', locations: ['-74,40,-73,41'], filter_level: 'medium'}
  twit.stream('statuses/filter', {track: interest, language: 'en'}, function(stream) {
    stream.on('data', function (data) {
      var turl = data.text.match( /(http|https|ftp):\/\/[^\s]*/i )
          if ( turl != null ) {
            turl = data.text.replace( turl[0], '<a href="'+turl[0]+'" target="new">'+turl[0]+'</a>' );
          } else {
            turl = data.text;
          }
      socket.emit('twitter:save', turl);
      // socket.emit('twitter:save', data);
      console.log("new tweet about: ", interest);
      res.send(200);
    });
  });
    // stream.on('end', function (response) {
    //   console.log("\n====================================================");
    //   console.log("DESTROYING");
    //   console.log("====================================================\n");
    // });
    // setTimeout(function(){
    //   stream.destroy();
    // }, 60000);
  };

}
// Get list of twitters
exports.index = function(req, res) {
  Twitter.find(function (err, twitters) {
    if(err) { return handleError(res, err); }
    return res.json(200, twitters);
  });
};

// Get a single twitter
exports.show = function(req, res) {
  Twitter.findById(req.params.id, function (err, twitter) {
    if(err) { return handleError(res, err); }
    if(!twitter) { return res.send(404); }
    return res.json(twitter);
  });
};

// Creates a new twitter in the DB.
exports.create = function(req, res) {
  Twitter.create(req.body, function(err, twitter) {
    if(err) { return handleError(res, err); }
    return res.json(201, twitter);
  });
};

// Updates an existing twitter in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Twitter.findById(req.params.id, function (err, twitter) {
    if (err) { return handleError(res, err); }
    if(!twitter) { return res.send(404); }
    var updated = _.merge(twitter, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, twitter);
    });
  });
};

// Deletes a twitter from the DB.
exports.destroy = function(req, res) {
  Twitter.findById(req.params.id, function (err, twitter) {
    if(err) { return handleError(res, err); }
    if(!twitter) { return res.send(404); }
    twitter.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
}