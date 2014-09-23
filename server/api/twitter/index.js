'use strict';

var express = require('express');
var controller = require('./twitter.controller');
module.exports = function(socketio) {
  var router = express.Router();
  // router.get('/:woeid', controller.trends)
  router.post('/search', controller.search(socketio))
  router.get('/', controller.index);
  router.get('/:id', controller.show);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.destroy);
  return router;
}
// module.exports = router;