/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sentiment = require('./sentiment.model');

exports.register = function(socket) {
  Sentiment.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sentiment.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sentiment:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sentiment:remove', doc);
}